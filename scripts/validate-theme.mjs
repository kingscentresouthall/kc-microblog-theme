import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const required = [
  "plugin.json", "theme.toml", "layouts/_default/baseof.html", "layouts/index.html",
  "layouts/news/list.html", "layouts/partials/home-content.html", "static/css/kc-site.css",
  "static/js/kc-site.js", "content/news/_index.md"
];
for (const file of required) await access(resolve(file));

const plugin = JSON.parse(await readFile(resolve("plugin.json"), "utf8"));
if (!plugin.title || !plugin.version) throw new Error("plugin.json is missing title or version");

const pages = (await readdir(resolve("content"))).filter((name) => name.endsWith(".html"));
if (pages.length < 13) throw new Error(`Expected at least 13 migrated pages, found ${pages.length}`);

const forbidden = /(?:api[_-]?key|access[_-]?token|password)\s*[:=]\s*["'][^"']+/i;
for (const file of [...required.filter((name) => !name.endsWith(".css") && !name.endsWith(".js")), ...pages.map((name) => `content/${name}`)]) {
  const text = await readFile(resolve(file), "utf8");
  if (forbidden.test(text)) throw new Error(`Possible credential in ${file}`);
}

console.log(`Theme validation passed: ${pages.length} public pages, no embedded credentials detected.`);
