export type SseMessage = {
    projectId: string;
    status: string;
};
export declare const subscribeToRunEvents: (projectId: string, onMessage: (payload: SseMessage) => void, onError: (error: Event) => void, onOpen?: () => void) => () => void;
