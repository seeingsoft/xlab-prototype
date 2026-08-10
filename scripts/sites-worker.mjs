const appShellPaths = new Set(["/", "/admin", "/ops"]);

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (!appShellPaths.has(url.pathname)) return env.ASSETS.fetch(request);

    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
