import fetch from "node-fetch";

export const sendSlackMessage = async (response_url, text) => {
  await fetch(response_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
};
