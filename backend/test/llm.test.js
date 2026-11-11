import { test } from "node:test";
import assert from "node:assert/strict";
import { createGroqClient, createClientFromEnv } from "../src/llm.js";

const realFetch = globalThis.fetch;
const reply = (status, body) => ({ ok: status < 400, status, json: async () => body, text: async () => JSON.stringify(body) });

test("Groq client sends an OpenAI-style request and reads the reply", async () => {
  let seen;
  globalThis.fetch = async (url, init) => {
    seen = { url, init, body: JSON.parse(init.body) };
    return reply(200, { choices: [{ message: { content: " Namaste " } }] });
  };
  try {
    const client = createGroqClient({ apiKey: "gsk_test" });
    const out = await client.complete({ system: "SYS", messages: [{ role: "user", content: "hi" }], maxTokens: 50 });
    assert.equal(out, "Namaste");
    assert.equal(seen.url, "https://api.groq.com/openai/v1/chat/completions");
    assert.equal(seen.init.headers.Authorization, "Bearer gsk_test");
    assert.equal(seen.body.model, "llama-3.3-70b-versatile");
    assert.deepEqual(seen.body.messages[0], { role: "system", content: "SYS" });
    assert.equal(seen.body.messages[1].content, "hi");
  } finally { globalThis.fetch = realFetch; }
});

test("Groq client falls back to the small model on a 429", async () => {
  const models = [];
  globalThis.fetch = async (_url, init) => {
    const { model } = JSON.parse(init.body);
    models.push(model);
    return model === "llama-3.3-70b-versatile"
      ? reply(429, { error: "rate limit" })
      : reply(200, { choices: [{ message: { content: "ok from small" } }] });
  };
  try {
    const out = await createGroqClient({ apiKey: "k" }).complete({ system: "s", messages: [], maxTokens: 10 });
    assert.equal(out, "ok from small");
    assert.deepEqual(models, ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]);
  } finally { globalThis.fetch = realFetch; }
});

test("provider selection from env", () => {
  assert.equal(createClientFromEnv({}), null);
  assert.equal(createClientFromEnv({ GROQ_API_KEY: "paste-your-groq-key-here" }), null);
  assert.match(createClientFromEnv({ GROQ_API_KEY: "gsk_abc" }).name, /^groq:/);
  assert.match(createClientFromEnv({ ANTHROPIC_API_KEY: "sk-ant-abc" }).name, /^anthropic:/);
});
