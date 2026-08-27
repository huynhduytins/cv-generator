export const AI_GENERATE_START_TAG = 'ai-generate-start';
export const AI_STREAM_TAG = 'ai-stream';
export const AI_GENERATE_END_TAG = 'ai-generate-end';
export const AI_ENTITIES_TAG = 'ai-entities';

export interface ExtractedEntity {
    end: number;
    entity: string;
    score: number;
    start: number;
    text: string;
}

interface ChatMessage {
    content: string;
    role: 'system' | 'user' | 'assistant';
}

interface GenerateDoneMessage {
    fullText: string;
    id: string;
    type: 'done';
}

interface GenerateErrorMessage {
    id: string;
    message: string;
    type: 'error';
}

interface GenerateAbortedMessage {
    id: string;
    type: 'aborted';
}

interface WorkerStatusMessage {
    id?: string;
    progress?: number | null;
    status: string;
    type: 'status';
}

interface WorkerTokenMessage {
    id: string;
    token: string;
    type: 'token';
}

type WorkerResponseMessage =
    | GenerateAbortedMessage
    | GenerateDoneMessage
    | GenerateErrorMessage
    | WorkerStatusMessage
    | WorkerTokenMessage;

function buildGenerateMessages(context: string): ChatMessage[] {
    console.log(context)
    if (context.trim()) {
        return [
            {
                content:
                    'You are an HR expert helping polish resume/CV content. Rewrite the paragraph below to sound more professional, concise, and impactful, while keeping the original meaning intact. Wrap only key skills, job titles, achievements, or numbers in double asterisks for emphasis(e.g. ** React **, ** 5 years **, ** Project Manager **).Do not over- highlight — only the most important 2 - 4 terms. Return ONLY the rewritten paragraph.No explanation, no preamble.',
                role: 'system',
            },
            {
                content: `${context}`,
                role: 'user',
            },
        ];
    }
    return [
        {
            content:
                'You are an HR expert helping polish resume/CV content. Write a single interesting opening paragraph about software engineer field. Write only the paragraph, nothing else.',
            role: 'system',
        },
        {
            content: 'Write an opening paragraph.',
            role: 'user',
        },
    ];
}

export interface AIExtensionConfig {
    w: Worker;
}

export interface GenerateOptions {
    maxTokens?: number;
    onToken?: (token: string) => void;
    stopAt?: string;
}

export function getAIHandlers(worker: AIExtensionConfig) {
    const { w } = worker

    function sendRequest(
        messages: ChatMessage[],
        options: GenerateOptions = {},
    ): Promise<string | null> {
        const { maxTokens = 256, onToken, stopAt } = options;
        const id = `req_${crypto.randomUUID()}`;
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                w.removeEventListener('error', handleError);
                w.removeEventListener('message', handleMessage as EventListener);
            };

            const handleError = (event: ErrorEvent) => {
                cleanup();
                reject(new Error(event.message || 'Web Worker failed.'));
            };

            const handleMessage = (event: MessageEvent<WorkerResponseMessage>) => {
                const data = event.data;
                if (!data || typeof data !== 'object') {
                    return;
                }
                if ('id' in data && data.id !== id) {
                    return;
                }

                if (data.type === 'token') {
                    onToken?.(data.token);
                    return;
                }

                if (data.type === 'done') {
                    cleanup();
                    resolve(data.fullText.trim());
                    return;
                }

                if (data.type === 'aborted') {
                    cleanup();
                    resolve(null);
                    return;
                }

                if (data.type === 'error') {
                    cleanup();
                    reject(new Error(data.message));
                }
            };

            w.addEventListener('error', handleError);
            w.addEventListener('message', handleMessage as EventListener);
            w.postMessage({ id, maxTokens, messages, stopAt, type: 'generate' });
        });
    }

    const generate = (
        context: string,
        options: GenerateOptions = {},
    ): Promise<string | null> => {
        const messages = buildGenerateMessages(context);
        return sendRequest(messages, { ...options, stopAt: options.stopAt ?? '\n\n' });
    };

    return {
        generate
    }
}

let worker: Worker | null = null

function createWorker(): Worker {
    return new Worker(new URL('./ai-worker.ts', import.meta.url), {
        type: 'module',
    });
}

export function getWorker(): Worker {
    if (worker) return worker

    worker = createWorker()

    return worker
}

export function terminateWorker(): void {
    if (!worker) return
    worker.terminate()
}