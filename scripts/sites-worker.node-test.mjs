import assert from "node:assert/strict";
import test from "node:test";
import worker from "../dist/server/index.js";

test("serves every public prototype page without a hosting-specific asset binding", async () => {
  for (const path of ["/", "/admin", "/ops", "/acceptance-map.html"]) {
    const response = await worker.fetch(new Request(`https://example.test${path}`));
    assert.equal(response.status, 200);
  }
});
