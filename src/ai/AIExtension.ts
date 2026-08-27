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

const boldTokenPattern = /\*\*([^*\n][^*\n]*?)\*\*/g;

const commonWords = new Set([
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'by',
    'for',
    'from',
    'in',
    'is',
    'it',
    'of',
    'on',
    'or',
    'that',
    'the',
    'to',
    'with',
    'will',
    'this',
    'these',
    'those',
    'into',
    'through',
    'across',
    'within',
    'over',
    'under',
]);

interface HighlightCandidate {
    score: number;
    token: string;
}

function extractBoldTokens(text: string): string[] {
    return Array.from(text.matchAll(boldTokenPattern)).map((match) => match[1].trim());
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wrapFirstOccurrenceOutsideBold(text: string, token: string): string {
    const segments = text.split(/(\*\*[^*\n]+\*\*)/g);
    const tokenPattern = new RegExp(`\\b${escapeRegExp(token)}\\b`);
    let hasWrapped = false;

    const wrappedSegments = segments.map((segment) => {
        if (hasWrapped || /^\*\*[^*\n]+\*\*$/.test(segment)) {
            return segment;
        }
        const nextSegment = segment.replace(tokenPattern, (match) => {
            hasWrapped = true;
            return `**${match}**`;
        });
        return nextSegment;
    });

    return hasWrapped ? wrappedSegments.join('') : text;
}

function pickHighlightCandidates(text: string, existing: Set<string>): HighlightCandidate[] {
    const plainText = text.replace(boldTokenPattern, '$1');
    const tokens = plainText.match(/[A-Za-z0-9][A-Za-z0-9+#./%-]*/g) ?? [];
    const seen = new Set<string>();
    const candidates: HighlightCandidate[] = [];

    tokens.forEach((token) => {
        const normalized = token.toLowerCase();
        if (seen.has(normalized) || existing.has(normalized) || commonWords.has(normalized)) {
            return;
        }

        seen.add(normalized);

        const hasDigit = /\d/.test(token);
        if (!hasDigit && token.length < 4) {
            return;
        }

        let score = 0;
        if (hasDigit) {
            score += 5;
        }
        if (/^[A-Z]/.test(token)) {
            score += 3;
        }
        if (/[+#./-]/.test(token)) {
            score += 2;
        }
        if (token.length >= 7) {
            score += 1;
        }

        if (score > 0) {
            candidates.push({ score, token });
        }
    });

    return candidates.sort((left, right) => {
        if (right.score !== left.score) {
            return right.score - left.score;
        }
        return right.token.length - left.token.length;
    });
}

function enforceBoldHighlights(text: string): string {
    let nextText = text.replace(/\*\*\s*([^*]+?)\s*\*\*/g, (_match, content: string) => {
        return `**${content.trim()}**`;
    });

    const existingBold = extractBoldTokens(nextText);
    if (existingBold.length >= 2) {
        return nextText;
    }

    const existingSet = new Set(existingBold.map((token) => token.toLowerCase()));
    const candidates = pickHighlightCandidates(nextText, existingSet);
    let highlightCount = existingBold.length;

    for (const candidate of candidates) {
        if (highlightCount >= 2) {
            break;
        }
        const wrapped = wrapFirstOccurrenceOutsideBold(nextText, candidate.token);
        if (wrapped === nextText) {
            continue;
        }
        nextText = wrapped;
        highlightCount += 1;
    }

    return nextText;
}

function buildGenerateMessages(context: string): ChatMessage[] {
    if (context.trim()) {
        return [
            {
                content:
                    'You are an HR expert helping polish resume/CV content. Rewrite the paragraph below to sound more professional, concise, and impactful, while keeping the original meaning intact. You must highlight exactly 2 to 4 of the most important skills, job titles, achievements, or numbers using markdown bold with double asterisks (for example: **React**, **5 years**, **Project Manager**). Return only one paragraph and do not use bullet points.',
                role: 'system',
            },
            {
                content: `Rewrite this paragraph and keep exactly 2 to 4 bold highlights:\n\n${context}`,
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
                    resolve(enforceBoldHighlights(data.fullText.trim()));
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