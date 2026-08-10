import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const dist = "dist";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return nested.flat();
}

const files = await filesIn(dist);
const assets = Object.fromEntries(await Promise.all(files.map(async (file) => {
  const path = `/${relative(dist, file).replaceAll("\\", "/")}`;
  const bytes = await readFile(file);
  return [path, [contentTypes[extname(file)] ?? "application/octet-stream", bytes.toString("base64")]];
})));

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", `
const assets = ${JSON.stringify(assets)};
const appShellPaths = new Set(["/", "/admin", "/ops"]);

function responseFor(asset) {
  const binary = atob(asset[1]);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      "cache-control": "public, max-age=300",
      "content-type": asset[0],
      "x-content-type-options": "nosniff",
    },
  });
}

export default {
  fetch(request) {
    const path = new URL(request.url).pathname;
    const asset = assets[appShellPaths.has(path) ? "/index.html" : path];
    return asset ? responseFor(asset) : new Response("Not found", { status: 404 });
  },
};
`.trimStart());
