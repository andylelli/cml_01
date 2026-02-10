export type SseMessage = {
  projectId: string;
  status: string;
};

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3005";

export const subscribeToRunEvents = (
  projectId: string,
  onMessage: (payload: SseMessage) => void,
  onError: (error: Event) => void,
) => {
  const source = new EventSource(`${apiBase}/api/projects/${projectId}/events`);

  source.addEventListener("ping", (event) => {
    try {
      const data = JSON.parse((event as MessageEvent<string>).data) as SseMessage;
      onMessage(data);
    } catch (error) {
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
