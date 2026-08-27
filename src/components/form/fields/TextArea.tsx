import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./FieldControls.module.css";
import { TbImageGeneration } from "react-icons/tb";
import { useAI } from "@/ai/useAI";

export interface TextSelectionRange {
  end: number;
  selectedText: string;
  start: number;
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
}

const TextArea = ({
  label,
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 120,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  errorText,
}: TextAreaProps) => {
  const inputId = useId();
  const ai = useAI();

  const [localValue, setLocalValue] = useState(value);
  const onDebouncedChangeRef =
    useRef<typeof onDebouncedChange>(onDebouncedChange);
  const selectedTextRef = useRef<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const tokenBufferRef = useRef("");
  const flushRafIdRef = useRef<number | null>(null);
  const cursorRafIdRef = useRef<number | null>(null);

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    if (!onDebouncedChangeRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDebouncedChangeRef.current?.(localValue);
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, localValue]);

  const emitSelection = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    const { selectionEnd, selectionStart, value: currentValue } =
      event.currentTarget;
    selectedTextRef.current = currentValue.slice(selectionStart, selectionEnd);
  };

  const stickToBottom = useCallback(() => {
    if (cursorRafIdRef.current !== null) {
      return;
    }
    cursorRafIdRef.current = window.requestAnimationFrame(() => {
      cursorRafIdRef.current = null;
      const textArea = textAreaRef.current;
      if (!textArea) {
        return;
      }
      textArea.focus({ preventScroll: true });
      const end = textArea.value.length;
      textArea.setSelectionRange(end, end);
      textArea.scrollTop = textArea.scrollHeight;
    });
  }, []);

  const flushTokenBuffer = useCallback(() => {
    const chunk = tokenBufferRef.current;
    tokenBufferRef.current = "";
    if (!chunk) {
      return;
    }
    setLocalValue((previous) => {
      const next = `${previous}${chunk}`;
      onChange(next);
      return next;
    });
    stickToBottom();
  }, [onChange, stickToBottom]);

  const enqueueGeneratedToken = useCallback(
    (token: string) => {
      tokenBufferRef.current += token;
      if (flushRafIdRef.current !== null) {
        return;
      }
      flushRafIdRef.current = window.requestAnimationFrame(() => {
        flushRafIdRef.current = null;
        flushTokenBuffer();
      });
    },
    [flushTokenBuffer],
  );

  const handleAIGenerate = async () => {
    const context = selectedTextRef.current || localValue;
    try {
      await ai.generate(context, {
        onToken: (token) => {
          enqueueGeneratedToken(token);
        },
      });
    } finally {
      if (flushRafIdRef.current !== null) {
        window.cancelAnimationFrame(flushRafIdRef.current);
        flushRafIdRef.current = null;
      }
      flushTokenBuffer();
      selectedTextRef.current = "";
    }
  };

  useEffect(() => {
    return () => {
      if (flushRafIdRef.current !== null) {
        window.cancelAnimationFrame(flushRafIdRef.current);
      }
      if (cursorRafIdRef.current !== null) {
        window.cancelAnimationFrame(cursorRafIdRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.fieldRoot}>
      <label htmlFor={inputId} className={styles.labelRow}>
        <span>{label}</span>
        {required ? <span className={styles.required}>*</span> : null}
      </label>
      <div className={styles.textareaContainer}>
        <textarea
          ref={textAreaRef}
          id={inputId}
          className={styles.textarea}
          value={localValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(errorText)}
          onChange={(event) => {
            const nextValue = event.target.value;
            setLocalValue(nextValue);
            onChange(nextValue);
          }}
          onSelect={emitSelection}
          onMouseUp={emitSelection}
          onKeyUp={emitSelection}
          onBlur={() => {
            selectedTextRef.current = "";
          }}
        />
        <button
          className={styles.generatorButton}
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={async () => {
            await handleAIGenerate();
          }}
        >
          <TbImageGeneration className={styles.generator} />
        </button>
      </div>
      {helperText ? <p className={styles.helperText}>{helperText}</p> : null}
      {errorText ? <p className={styles.errorText}>{errorText}</p> : null}
    </div>
  );
};

export default TextArea;
