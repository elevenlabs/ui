const HTTPS_API_ORIGIN = "https://api.elevenlabs.io";

export function postOverallFeedback(
  conversationId: string,
  like: boolean,
  origin: string = HTTPS_API_ORIGIN
) {
  return fetch(`${origin}/v1/convai/conversations/${conversationId}/feedback`, {
    method: "POST",
    body: JSON.stringify({
      feedback: like ? "like" : "dislike",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
