import { useCallback, useEffect, useRef, useState } from 'react';

import { type GenerateOptions, getAIHandlers, getWorker } from './AIExtension';

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

interface WorkerStatusEvent {
    progress?: number | null;
    status?: string;
    type: string;
}

export interface UseAIReturn {
    generate: (context: string, options?: GenerateOptions) => Promise<string | null>;
    dispose: () => void;
    isGenerating: boolean;
    loadProgress: number | null;
    modelStatus: ModelStatus;
}

export function useAI(): UseAIReturn {
    const workerRef = useRef<Worker | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadProgress, setLoadProgress] = useState<number | null>(null);
    const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
    useEffect(() => {
        const worker = getWorker();
        workerRef.current = worker;

        const handleStatus = (event: MessageEvent<WorkerStatusEvent>) => {
            const { progress, status, type } = event.data;
            if (type !== 'status') {
                return;
            }

            if (typeof progress === 'number') {
                setLoadProgress(progress);
            }

            if (!status) {
                return;
            }
            if (status === 'model-ready' || status === 'ner-ready') {
                setModelStatus('ready');
                return;
            }
            setModelStatus('loading');
        };

        worker.addEventListener('message', handleStatus as EventListener);

        return () => {
            worker.removeEventListener('message', handleStatus as EventListener);
            workerRef.current = null;
        };
    }, []);

    const generate = useCallback(async (
        context: string,
        options?: GenerateOptions,
    ): Promise<string | null> => {
        const worker = workerRef.current;
        if (!worker) {
            return null;
        }

        setIsGenerating(true);
        const handlers = getAIHandlers({ w: worker });
        try {
            return await handlers.generate(context, options);
        } catch (error: unknown) {
            setModelStatus('error');
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to generate text.');
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const dispose = useCallback(() => {
        const worker = workerRef.current;
        if (!worker) {
            return;
        }
        worker.terminate();
        workerRef.current = null;
        setIsGenerating(false);
    }, []);

    return {
        dispose,
        generate,
        isGenerating,
        loadProgress,
        modelStatus,
    };
}
