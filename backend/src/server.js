// import { readFileSync } from "node:fs";
// import { fileURLToPath, pathToFileURL } from "node:url";
// import path from "node:path";
// import express from "express";
// import cors from "cors";
// import { rateLimit } from "express-rate-limit";
// import { createClientFromEnv } from "./llm.js";
// import { buildFaq, findFaqAnswer } from "./faq.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const knowledge = JSON.parse(
//   readFileSync(path.join(__dirname, "../data/knowledge.json"), "utf8"),
// );
// const faq = buildFaq(knowledge);

// const LIMITS = {
//   messageChars: 1000,
//   historyMessages: 10,
//   historyChars: 2000,
// };

// const LANGUAGES = {
//   en: "English",
//   hi: "Hindi (Devanagari script)",
//   mr: "Marathi (Devanagari script)",
// };

// function buildSystemPrompt(language) {
//   const languageRule = LANGUAGES[language]
//     ? `Reply in ${LANGUAGES[language]}.`
//     : "Reply in the same language the farmer writes in (English, Hindi or Marathi).";

//   return `You are Kishan Saathi Assistant, a friendly guide that helps Indian farmers understand agricultural loans, government schemes and the documents banks usually ask for.

// HOW TO ANSWER
// - ${languageRule}
// - Use short sentences and simple words. Many users are farmers with little time and limited reading practice. Keep answers under about 180 words unless the farmer asks for detail. Short bullet lists are fine.
// - Treat the KNOWLEDGE BASE below as your main source for schemes, documents and eligibility. Do not invent interest rates, loan limits, deadlines, subsidy percentages, phone numbers or website addresses that are not in it. If you do not know, say so plainly and tell the farmer to ask their bank branch or call the Kisan Call Centre.
// - Rates, limits and rules change. When you mention any figure, remind the farmer to confirm the current value with their bank or the official scheme website.
// - Never promise or imply that a loan will be approved. Say that only the bank decides.
// - Do not ask for or accept Aadhaar numbers, bank account numbers, OTPs or passwords. If the farmer shares them, tell them not to share such details in chat.
// - If the question is about live weather or today's mandi prices, explain you do not have live data here and point to the IMD / local mandi / e-NAM sources. You may give general crop and farming guidance, kept careful and practical.
// - If the question is unrelated to farming, politely say you can only help with farming, loans and schemes.
// - Be respectful and warm. Begin directly with the answer, not with long introductions.

// KNOWLEDGE BASE (JSON):
// ${JSON.stringify(
//     {
//       schemes: knowledge.schemes,
//       documents: knowledge.documents,
//       eligibility_basics: knowledge.eligibility_basics,
//       safety_tips: knowledge.safety_tips,
//       helplines: knowledge.helplines,
//     },
//     null,
//     2,
//   )}`;
// }

// // Keep only well-formed turns, start with a user turn, and alternate roles,
// // because the Messages API requires that.
// export function sanitizeHistory(history) {
//   if (!Array.isArray(history)) return [];
//   const cleaned = [];
//   for (const item of history.slice(-LIMITS.historyMessages)) {
//     if (!item || typeof item.content !== "string") continue;
//     if (item.role !== "user" && item.role !== "assistant") continue;
//     const content = item.content.trim().slice(0, LIMITS.historyChars);
//     if (!content) continue;
//     const last = cleaned[cleaned.length - 1];
//     if (cleaned.length === 0 && item.role !== "user") continue;
//     if (last && last.role === item.role) continue;
//     cleaned.push({ role: item.role, content });
//   }
//   // The new user message is appended after history, so history must end with an assistant turn.
//   while (cleaned.length && cleaned[cleaned.length - 1].role === "user") cleaned.pop();
//   return cleaned;
// }

// export function createApp({ client } = {}) {
//   const app = express();
//   const allowedOrigins = (
//     process.env.CORS_ORIGINS ||
//     "http://localhost:5173,http://localhost:8080,http://localhost:3000"
//   )
//     .split(",")
//     .map((o) => o.trim())
//     .filter(Boolean);

//   app.disable("x-powered-by");
//   app.use(
//     cors({
//       origin(origin, callback) {
//         // Allow tools without an Origin header (curl, health checks) and listed frontends.
//         if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
//         return callback(new Error("Origin not allowed"));
//       },
//     }),
//   );
//   app.use(express.json({ limit: "20kb" }));

//   app.get("/api/health", (_req, res) => {
//     res.json({ status: "ok", aiConfigured: Boolean(client) });
//   });

//   app.post(
//     "/api/chat",
//     rateLimit({
//       windowMs: 60_000,
//       limit: 20,
//       standardHeaders: true,
//       legacyHeaders: false,
//       message: { error: "Too many questions. Please wait a minute and try again." },
//     }),
//     async (req, res) => {
//       const body = req.body ?? {};
//       const message = typeof body.message === "string" ? body.message.trim() : "";
//       const language = typeof body.language === "string" ? body.language : "auto";

//       if (!message) {
//         return res.status(400).json({ error: "Please type a question." });
//       }
//       if (message.length > LIMITS.messageChars) {
//         return res.status(400).json({
//           error: `Please keep your question under ${LIMITS.messageChars} characters.`,
//         });
//       }

//       // Instant, verified answers for the quick-reply chips (English only,
//       // so Hindi/Marathi users still get a translated answer from the model).
//       const canned = findFaqAnswer(faq, message);
//       if (canned && (language === "en" || language === "auto" || !client)) {
//         return res.json({ reply: canned, source: "knowledge-base" });
//       }

//       if (!client) {
//         return res.status(503).json({
//           error:
//             "The assistant is not fully set up yet. Please try one of the quick questions, or ask the site owner to add the API key.",
//         });
//       }

//       try {
//         const reply = await client.complete({
//           system: buildSystemPrompt(language),
//           messages: [...sanitizeHistory(body.history), { role: "user", content: message }],
//           maxTokens: 700,
//         });

//         if (!reply) throw new Error("Empty reply from model");
//         return res.json({ reply, source: "ai" });
//       } catch (error) {
//         console.error("Chat error:", error?.status ?? "", error?.message ?? error);
//         const status = error?.status === 429 ? 503 : 502;
//         return res.status(status).json({
//           error: "The assistant could not answer right now. Please try again in a moment.",
//         });
//       }
//     },
//   );

//   // Malformed JSON, blocked CORS origin, etc.
//   app.use((error, _req, res, _next) => {
//     if (error?.type === "entity.parse.failed") {
//       return res.status(400).json({ error: "Invalid request." });
//     }
//     if (error?.message === "Origin not allowed") {
//       return res.status(403).json({ error: "Origin not allowed." });
//     }
//     console.error(error);
//     return res.status(500).json({ error: "Something went wrong." });
//   });

//   return app;
// }

// const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

// if (isMain) {
//   const client = createClientFromEnv();
//   if (client) {
//     console.log(`AI provider: ${client.name}`);
//   } else {
//     console.warn(
//       "WARNING: No GROQ_API_KEY set. Only the quick-question answers will work. See .env.example",
//     );
//   }
//   const port = Number(process.env.PORT) || 8000;
//   createApp({ client }).listen(port, () => {
//     console.log(`Kishan Saathi backend running on http://localhost:${port}`);
//   });
// }


import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { createClientFromEnv } from "./llm.js";
import { createAuth, createAuthFromEnv } from "./auth.js";
import { buildFaq, findFaqAnswer } from "./faq.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const knowledge = JSON.parse(
  readFileSync(path.join(__dirname, "../data/knowledge.json"), "utf8"),
);
const faq = buildFaq(knowledge);

const LIMITS = {
  messageChars: 1000,
  historyMessages: 10,
  historyChars: 2000,
};

const MANDI_FILTERS = ["state", "district", "commodity", "market"];
const MANDI_FILTER_MAX_CHARS = 100;
const MANDI_MAX_LIMIT = 100;

const LANGUAGES = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  mr: "Marathi (Devanagari script)",
};

function buildSystemPrompt(language) {
  const languageRule = LANGUAGES[language]
    ? `Reply in ${LANGUAGES[language]}.`
    : "Reply in the same language the farmer writes in (English, Hindi or Marathi).";

  return `You are Kishan Saathi Assistant, a friendly guide that helps Indian farmers understand agricultural loans, government schemes and the documents banks usually ask for.

HOW TO ANSWER
- ${languageRule}
- Use short sentences and simple words. Many users are farmers with little time and limited reading practice. Keep answers under about 180 words unless the farmer asks for detail. Short bullet lists are fine.
- Treat the KNOWLEDGE BASE below as your main source for schemes, documents and eligibility. Do not invent interest rates, loan limits, deadlines, subsidy percentages, phone numbers or website addresses that are not in it. If you do not know, say so plainly and tell the farmer to ask their bank branch or call the Kisan Call Centre.
- Rates, limits and rules change. When you mention any figure, remind the farmer to confirm the current value with their bank or the official scheme website.
- Never promise or imply that a loan will be approved. Say that only the bank decides.
- Do not ask for or accept Aadhaar numbers, bank account numbers, OTPs or passwords. If the farmer shares them, tell them not to share such details in chat.
- If the question is about live weather or today's mandi prices, explain you do not have live data here and point to the IMD / local mandi / e-NAM sources. You may give general crop and farming guidance, kept careful and practical.
- If the question is unrelated to farming, politely say you can only help with farming, loans and schemes.
- Be respectful and warm. Begin directly with the answer, not with long introductions.

KNOWLEDGE BASE (JSON):
${JSON.stringify(
    {
      schemes: knowledge.schemes,
      documents: knowledge.documents,
      eligibility_basics: knowledge.eligibility_basics,
      safety_tips: knowledge.safety_tips,
      helplines: knowledge.helplines,
    },
    null,
    2,
  )}`;
}

// Keep only well-formed turns, start with a user turn, and alternate roles,
// because the Messages API requires that.
export function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  const cleaned = [];
  for (const item of history.slice(-LIMITS.historyMessages)) {
    if (!item || typeof item.content !== "string") continue;
    if (item.role !== "user" && item.role !== "assistant") continue;
    const content = item.content.trim().slice(0, LIMITS.historyChars);
    if (!content) continue;
    const last = cleaned[cleaned.length - 1];
    if (cleaned.length === 0 && item.role !== "user") continue;
    if (last && last.role === item.role) continue;
    cleaned.push({ role: item.role, content });
  }
  // The new user message is appended after history, so history must end with an assistant turn.
  while (cleaned.length && cleaned[cleaned.length - 1].role === "user") cleaned.pop();
  return cleaned;
}

export function createApp({
  client,
  auth = createAuth(),
  dataGovApiKey = process.env.DATA_GOV_API_KEY,
  dataGovResourceId = process.env.DATA_GOV_RESOURCE_ID,
} = {}) {
  const app = express();
  const allowedOrigins = (
    process.env.CORS_ORIGINS ||
    "http://localhost:5173,http://localhost:8080,http://localhost:3000"
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.disable("x-powered-by");
  app.use(
    cors({
      origin(origin, callback) {
        // Allow tools without an Origin header (curl, health checks) and listed frontends.
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin not allowed"));
      },
    }),
  );
  app.use(express.json({ limit: "8mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      aiConfigured: Boolean(client),
      visionConfigured: Boolean(client?.completeVision),
      loginRequired: auth.required,
      mandiConfigured: Boolean(dataGovApiKey && dataGovResourceId),
    });
  });

  app.get("/api/mandi-prices", auth.middleware, async (req, res) => {
    if (!dataGovApiKey || !dataGovResourceId) {
      return res.status(503).json({
        error: "Mandi prices are not configured. Add DATA_GOV_API_KEY and DATA_GOV_RESOURCE_ID to the backend environment.",
      });

    }

    const requestedLimit = Number(req.query.limit);
    const requestedOffset = Number(req.query.offset);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), MANDI_MAX_LIMIT)
      : 20;
    const offset = Number.isInteger(requestedOffset) ? Math.max(requestedOffset, 0) : 0;
    const url = new URL(`https://api.data.gov.in/resource/${dataGovResourceId}`);
    url.searchParams.set("api-key", dataGovApiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    for (const field of MANDI_FILTERS) {
      const value = typeof req.query[field] === "string" ? req.query[field].trim() : "";
      if (value.length > MANDI_FILTER_MAX_CHARS) {
        return res.status(400).json({
          error: `${field} must be ${MANDI_FILTER_MAX_CHARS} characters or fewer.`,
        });
      }
      if (value) url.searchParams.set(`filters[${field}]`, value);
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!response.ok) {
        console.error("Mandi API request failed:", response.status);
        if (response.status === 429) {
          return res.status(503).json({
            error: "Mandi prices are temporarily rate-limited. Please try again shortly.",
          });
        }
        return res.status(502).json({ error: "Mandi prices are temporarily unavailable." });
      }

      const payload = await response.json();
      if (!Array.isArray(payload.records)) {
        console.error("Mandi API returned an unexpected response shape");
        return res.status(502).json({ error: "Mandi prices returned an unexpected response." });
      }

      return res.json({
        records: payload.records,
        total: Number(payload.total) || payload.records.length,
        limit,
        offset,
      });
    } catch (error) {
      console.error("Mandi API error:", error?.message ?? error);
      return res.status(502).json({ error: "Mandi prices are temporarily unavailable." });
    }
  });

  app.post("/api/crop-health", auth.middleware, async (req, res) => {
    if (typeof client?.completeVision !== "function") {
      return res.status(503).json({
        error:
          "Image analysis is not configured. Add GROQ_VISION_MODEL with an image-capable Groq model to the backend environment.",
      });
    }

    const { imageData, crop, language } = req.body ?? {};
    if (
      typeof imageData !== "string" ||
      !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(imageData) ||
      imageData.length > 7_000_000
    ) {
      return res.status(400).json({ error: "Upload a valid JPG, PNG or WebP image smaller than 5 MB." });
    }

    try {
      const reply = await client.completeVision({
        system:
          "You are a cautious crop-health assistant for Indian farmers. Inspect the provided crop image and reply with short headings: Possible problem, visible symptoms, possible causes, immediate steps, and when to contact an agriculture expert. If the image is unclear, say that plainly. Never claim a definitive diagnosis, never invent a confidence score, and do not recommend unsafe pesticide doses. Reply in the requested language.",
        imageData,
        crop: typeof crop === "string" ? crop.slice(0, 100) : "",
        language: ["en", "hi", "mr"].includes(language) ? language : "en",
      });
      if (!reply) throw new Error("Empty vision response");
      return res.json({ reply, source: "vision-ai" });
    } catch (error) {
      console.error("Crop health analysis error:", error?.status ?? "", error?.message ?? error);
      return res.status(502).json({ error: "Crop image analysis is temporarily unavailable." });
    }
  });

  app.post(
    "/api/chat",
    rateLimit({
      windowMs: 60_000,
      limit: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many questions. Please wait a minute and try again." },
    }),
    auth.middleware,
    async (req, res) => {
      const body = req.body ?? {};
      const message = typeof body.message === "string" ? body.message.trim() : "";
      const language = typeof body.language === "string" ? body.language : "auto";

      if (!message) {
        return res.status(400).json({ error: "Please type a question." });
      }
      if (message.length > LIMITS.messageChars) {
        return res.status(400).json({
          error: `Please keep your question under ${LIMITS.messageChars} characters.`,
        });
      }

      // Instant, verified answers for the quick-reply chips (English only,
      // so Hindi/Marathi users still get a translated answer from the model).
      const canned = findFaqAnswer(faq, message);
      if (canned && (language === "en" || language === "auto" || !client)) {
        return res.json({ reply: canned, source: "knowledge-base" });
      }

      if (!client) {
        return res.status(503).json({
          error:
            "The assistant is not fully set up yet. Please try one of the quick questions, or ask the site owner to add the API key.",
        });
      }

      try {
        const reply = await client.complete({
          system: buildSystemPrompt(language),
          messages: [...sanitizeHistory(body.history), { role: "user", content: message }],
          maxTokens: 700,
        });

        if (!reply) throw new Error("Empty reply from model");
        return res.json({ reply, source: "ai" });
      } catch (error) {
        console.error("Chat error:", error?.status ?? "", error?.message ?? error);
        const status = error?.status === 429 ? 503 : 502;
        return res.status(status).json({
          error: "The assistant could not answer right now. Please try again in a moment.",
        });
      }
    },
  );

  // Malformed JSON, blocked CORS origin, etc.
  app.use((error, _req, res, _next) => {
    if (error?.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Invalid request." });
    }
    if (error?.message === "Origin not allowed") {
      return res.status(403).json({ error: "Origin not allowed." });
    }
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  });

  return app;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const client = createClientFromEnv();
  const auth = createAuthFromEnv();
  console.log(
    auth.enabled
      ? `Login check: ON (${auth.required ? "login required" : "login optional"})`
      : "Login check: OFF (set FIREBASE_PROJECT_ID to turn it on)",
  );
  if (client) {
    console.log(`AI provider: ${client.name}`);
  } else {
    console.warn(
      "WARNING: No GROQ_API_KEY set. Only the quick-question answers will work. See .env.example",
    );
  }
  const port = Number(process.env.PORT) || 8000;
  createApp({ client, auth }).listen(port, () => {
    console.log(`Kishan Saathi backend running on http://localhost:${port}`);
  });
}