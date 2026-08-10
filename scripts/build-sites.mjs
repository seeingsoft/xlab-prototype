import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await copyFile("scripts/sites-worker.mjs", "dist/server/index.js");
