// Tiny provider layer. Both providers are called with plain fetch (no SDK),
// and expose the same interface:  client.complete({ system, messages, maxTokens }) -> string

const TIMEOUT_MS = 30_000;

async function postJson(url, headers, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`HTTP ${response.status}: ${detail.slice(0, 300)}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function createGroqClient({
  apiKey,
  model = "llama-3.3-70b-versatile",
  fallbackModel = "llama-3.1-8b-instant",
  visionModel,
}) {
  const call = async (useModel, { system, messages, maxTokens }) => {
    const data = await postJson(
      "https://api.groq.com/openai/v1/chat/completions",
      { Authorization: `Bearer ${apiKey}` },
      {
          model: useModel,
          max_tokens: Math.max(maxTokens, 2000),
          reasoning_effort: "low",
          temperature: 0.3,
          messages: [{ role: "system", content: system }, ...messages],
      },
    );
    return data?.choices?.[0]?.message?.content?.trim() ?? "";
  };

  return {
    name: `groq:${model}`,
    async complete(request) {
      try {
        return await call(model, request);
      } catch (error) {
        // Free tier: when the big model's daily/minute limit is hit, try the smaller one.
        if (error.status === 429 && fallbackModel && fallbackModel !== model) {
          console.warn(`Groq rate limit on ${model}; retrying with ${fallbackModel}`);
          return call(fallbackModel, request);
        }
        throw error;
      }
    },
    ...(visionModel
      ? {
          async completeVision({ system, imageData, crop, language, maxTokens = 700 }) {
            const data = await postJson(
              "https://api.groq.com/openai/v1/chat/completions",
              { Authorization: `Bearer ${apiKey}` },
              {
                model: visionModel,
                max_tokens: maxTokens,
                temperature: 0.2,
                messages: [
                  { role: "system", content: system },
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: `Crop: ${crop || "unknown"}\nLanguage: ${language}\nGive preliminary guidance only. Do not claim certainty or a confidence score unless the image supports it.`,
                      },
                      { type: "image_url", image_url: { url: imageData } },
                    ],
                  },
                ],
              },
            );
            return data?.choices?.[0]?.message?.content?.trim() ?? "";
          },
        }
      : {}),
  };
}

export function createAnthropicClient({ apiKey, model = "claude-sonnet-5-5" }) {
  return {
    name: `anthropic:${model}`,
    async complete({ system, messages, maxTokens }) {
      const data = await postJson(
        "https://api.anthropic.com/v1/messages",
        { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        { model, max_tokens: maxTokens, system, messages },
      );
      return (data.content ?? [])
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();
    },
  };
}

const isPlaceholder = (value) => !value || /your-key|paste|here$/i.test(value);

// Groq is preferred (free tier). Anthropic is used only if no Groq key is set.
export function createClientFromEnv(env = process.env) {
  if (!isPlaceholder(env.GROQ_API_KEY)) {
    return createGroqClient({
      apiKey: env.GROQ_API_KEY,
      ...(env.GROQ_MODEL && { model: env.GROQ_MODEL }),
      ...(env.GROQ_FALLBACK_MODEL && { fallbackModel: env.GROQ_FALLBACK_MODEL }),
      ...(env.GROQ_VISION_MODEL && { visionModel: env.GROQ_VISION_MODEL }),
    });
  }
  if (!isPlaceholder(env.ANTHROPIC_API_KEY)) {
    return createAnthropicClient({
      apiKey: env.ANTHROPIC_API_KEY,
      ...(env.CLAUDE_MODEL && { model: env.CLAUDE_MODEL }),
    });
  }
  return null;
}
