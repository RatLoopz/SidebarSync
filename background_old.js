// background.js (service worker)

// ----- Helpers to load settings -----
function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["provider", "apiKey", "model"], (data) => {
      resolve({
        provider: data.provider || "openai",
        apiKey: data.apiKey || "",
        model:
          data.model ||
          (data.provider === "gemini" ? "gemini-1.5-flash" : "gpt-3.5-turbo"),
      });
    });
  });
}

// ----- Prompt builder -----
function buildPrompt(postText, style) {
  const baseInstruction = `
You are an assistant that writes high-quality LinkedIn comments.

Requirements:
- Language: natural, professional, friendly.
- Must be 1 short paragraph (2–4 sentences) for short, 3–6 sentences for long.
- Emoji+ style should include relevant emojis but not look spammy.
- DO NOT sound like generic AI; sound human, specific to the post.
- The user will review before posting, so it's okay to be slightly opinionated but stay respectful.

Post content:
"""${postText || ""}"""
`;

  const styleInstruction =
    style === "short"
      ? "Write a short supportive comment."
      : style === "long"
      ? "Write a longer, more detailed comment that adds value or perspective."
      : "Write a short comment that includes 2–4 relevant emojis naturally.";

  return `${baseInstruction}\nStyle: ${styleInstruction}\nReturn ONLY the comment text, no explanations.`;
}

// ----- OpenAI call (chat completions) -----
async function callOpenAI(apiKey, model, prompt) {
  if (!apiKey) throw new Error("Missing OpenAI API key");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You write concise, natural LinkedIn comments.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 180,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`;

      // Provide more user-friendly error messages
      if (res.status === 401) {
        throw new Error("Invalid OpenAI API key. Please check your API key in the extension options.");
      } else if (res.status === 429) {
        throw new Error("OpenAI API rate limit exceeded. Please try again later.");
      } else if (res.status === 404) {
        throw new Error(`Model "${model}" not found. Please check your model name in the extension options.`);
      } else {
        throw new Error(`OpenAI API error: ${errorMessage}`);
      }
    }

    const data = await res.json();
    const comment = data.choices?.[0]?.message?.content?.trim() || "";

    if (!comment) {
      throw new Error("OpenAI returned an empty response. Please try again.");
    }

    return comment;
  } catch (error) {
    console.error("OpenAI API call failed:", error);

    // Re-throw with a more user-friendly message if it's not already user-friendly
    if (error.message.startsWith("OpenAI") || 
        error.message.includes("API key") || 
        error.message.includes("rate limit") ||
        error.message.includes("Model") ||
        error.message.includes("empty response")) {
      throw error;
    } else {
      throw new Error("Failed to connect to OpenAI. Please check your internet connection and try again.");
    }
  }
}

// ----- Gemini call (REST generateContent) -----
async function callGemini(apiKey, model, prompt) {
  if (!apiKey) throw new Error("Missing Gemini API key");

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${res.status}: ${res.statusText}`;

      // Provide more user-friendly error messages
      if (res.status === 401 || res.status === 403) {
        throw new Error("Invalid Gemini API key. Please check your API key in the extension options.");
      } else if (res.status === 429) {
        throw new Error("Gemini API rate limit exceeded. Please try again later.");
      } else if (res.status === 404) {
        throw new Error(`Model "${model}" not found. Please check your model name in the extension options.`);
      } else {
        throw new Error(`Gemini API error: ${errorMessage}`);
      }
    }

    const data = await res.json();

    // Check for safety filters or other issues
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked by Gemini safety filters: ${data.promptFeedback.blockReason}`);
    }

    const candidate = data.candidates?.[0];

    if (!candidate) {
      throw new Error("Gemini returned no candidates. Please try again.");
    }

    // Check for content safety issues in the response
    if (candidate.finishReason === "SAFETY") {
      throw new Error("Gemini blocked the generated comment due to safety concerns. Please try with a different post.");
    }

    const parts = candidate?.content?.parts || [];
    const text = parts
      .map((p) => p.text || "")
      .join(" ")
      .trim();

    if (!text) {
      throw new Error("Gemini returned an empty response. Please try again.");
    }

    return text;
  } catch (error) {
    console.error("Gemini API call failed:", error);

    // Re-throw with a more user-friendly message if it's not already user-friendly
    if (error.message.startsWith("Gemini") || 
        error.message.includes("API key") || 
        error.message.includes("rate limit") ||
        error.message.includes("Model") ||
        error.message.includes("empty response") ||
        error.message.includes("blocked") ||
        error.message.includes("safety")) {
      throw error;
    } else {
      throw new Error("Failed to connect to Gemini. Please check your internet connection and try again.");
    }
  }
}

// ----- Main entry for content script -----
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "generateComment") {
    (async () => {
      try {
        const { provider, apiKey, model } = await getSettings();

        if (!apiKey) {
          throw new Error("No API key set in extension options.");
        }

        const prompt = buildPrompt(message.postText, message.style);

        let commentText;
        if (provider === "gemini") {
          commentText = await callGemini(apiKey, model, prompt);
        } else {
          commentText = await callOpenAI(apiKey, model, prompt);
        }

        sendResponse({ ok: true, text: commentText });
      } catch (err) {
        console.error(err);
        sendResponse({ ok: false, error: String(err) });
      }
    })();

    // Tell Chrome we’ll respond async
    return true;
  }
});
