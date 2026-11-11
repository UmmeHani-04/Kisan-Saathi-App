import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp, sanitizeHistory } from "../src/server.js";

let server;
let base;

function startWith(client) {
  return new Promise((resolve) => {
    const s = createApp({ client }).listen(0, () => resolve(s));
  });
}

const post = (url, body) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

before(async () => {
  server = await startWith(null);
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

test("health reports AI not configured when there is no client", async () => {
  const data = await (await fetch(`${base}/api/health`)).json();
  assert.equal(data.status, "ok");
  assert.equal(data.aiConfigured, false);
  assert.equal(data.visionConfigured, false);
});

test("crop health reports configuration instead of fabricating a result", async () => {
  const res = await post(`${base}/api/crop-health`, {
    imageData: "data:image/png;base64,AAAA",
    language: "en",
  });
  assert.equal(res.status, 503);
  assert.match((await res.json()).error, /GROQ_VISION_MODEL/);
});

test("crop health passes a valid image to the configured vision client", async () => {
  let captured;
  const fake = {
    completeVision: async (args) => {
      captured = args;
      return "Possible problem: inspect with an agriculture expert.";
    },
  };
  const s = await startWith(fake);
  const res = await post(`http://localhost:${s.address().port}/api/crop-health`, {
    imageData: "data:image/png;base64,AAAA",
    crop: "wheat",
    language: "hi",
  });
  s.close();
  assert.equal(res.status, 200);
  assert.equal((await res.json()).source, "vision-ai");
  assert.equal(captured.crop, "wheat");
  assert.equal(captured.language, "hi");
});

test("empty message is rejected", async () => {
  const res = await post(`${base}/api/chat`, { message: "   " });
  assert.equal(res.status, 400);
});

test("overlong message is rejected", async () => {
  const res = await post(`${base}/api/chat`, { message: "a".repeat(1001) });
  assert.equal(res.status, 400);
});

test("KCC chip question is answered from the knowledge base without an API key", async () => {
  const res = await post(`${base}/api/chat`, { message: "What is the Kisan Credit Card scheme?" });
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.source, "knowledge-base");
  assert.match(data.reply, /Kisan Credit Card/);
});

test("free-form question without an API key returns a friendly 503", async () => {
  const res = await post(`${base}/api/chat`, { message: "Can I get a tractor loan?" });
  assert.equal(res.status, 503);
  assert.ok((await res.json()).error);
});

test("free-form question calls the model and returns { reply }", async () => {
  let captured;
  const fake = {
    complete: async (args) => {
      captured = args;
      return "Yes, tractor loans exist.";
    },
  };
  const s = await startWith(fake);
  const url = `http://localhost:${s.address().port}/api/chat`;
  const res = await post(url, {
    message: "Can I get a tractor loan?",
    language: "hi",
    history: [{ role: "assistant", content: "stray" }, { role: "user", content: "hi" }, { role: "assistant", content: "Namaste" }],
  });
  s.close();
  assert.equal((await res.json()).reply, "Yes, tractor loans exist.");
  assert.match(captured.system, /Hindi/);
  assert.deepEqual(captured.messages.map((m) => m.role), ["user", "assistant", "user"]);
});

test("model failure returns a friendly error, not a crash", async () => {
  const fake = { complete: async () => { throw Object.assign(new Error("boom"), { status: 500 }); } };
  const s = await startWith(fake);
  const res = await post(`http://localhost:${s.address().port}/api/chat`, { message: "hello" });
  s.close();
  assert.equal(res.status, 502);
  assert.ok((await res.json()).error);
});

test("sanitizeHistory fixes ordering", () => {
  const out = sanitizeHistory([
    { role: "assistant", content: "a" },
    { role: "user", content: "b" },
    { role: "user", content: "c" },
    { role: "assistant", content: "d" },
    { role: "user", content: "e" },
  ]);
  assert.deepEqual(out.map((m) => m.role), ["user", "assistant"]);
});
