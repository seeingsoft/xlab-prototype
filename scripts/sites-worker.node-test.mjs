import assert from "node:assert/strict";
import test from "node:test";
import worker from "./sites-worker.mjs";

test("serves the app shell for the three prototype surfaces and preserves static files", async () => {
  const seen = [];
  const env = {
    ASSETS: {
      fetch: async (request) => {
        seen.push(new URL(request.url).pathname);
        return new Response("ok");
      },
    },
  };

  for (const path of ["/", "/admin", "/ops", "/acceptance-map.html"]) {
    await worker.fetch(new Request(`https://example.test${path}`), env);
  }

  assert.deepEqual(seen, ["/index.html", "/index.html", "/index.html", "/acceptance-map.html"]);
});
