const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3005";
export const subscribeToRunEvents = (projectId, onMessage, onError, onOpen) => {
    const source = new EventSource(`${apiBase}/api/projects/${projectId}/events`);
    source.addEventListener("open", () => {
        onOpen?.();
    });
    source.addEventListener("ping", (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessage(data);
        }
        catch (error) {
            console.error("Failed to parse SSE payload", error);
        }
    });
    source.onerror = (event) => {
        onError(event);
    };
    return () => {
        source.close();
    };
};
//# sourceMappingURL=sse.js.map