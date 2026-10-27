import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const source = resolve(process.argv[2] ?? "../wix-fixes-preview/dist");
const target = resolve(process.argv[3] ?? "./content");
const pages = [
  "about.html", "academy.html", "contact.html", "local-projects.html", "myriad.html",
  "news-publishing.html", "privacy.html", "programmes.html", "safeguarding.html",
  "team.html", "training.html", "trustees.html", "youth.html"
];

const publicBase = "https://kingscentresouthall.org.uk/";
const titles = new Map([
  ["about", "About"], ["academy", "Football academy"], ["contact", "Contact"],
  ["local-projects", "Local projects"], ["myriad", "Myriad"],
  ["news-publishing", "Publishing news"], ["privacy", "Privacy and cookies"],
  ["programmes", "What we do"], ["safeguarding", "Safeguarding"],
  ["team", "Our team"], ["training", "Training"], ["trustees", "Our trustees"],
  ["youth", "Youth and community"]
]);

function migrateLinks(html) {
  return html
    .replaceAll('href="index.html"', 'href="/"')
    .replaceAll('href="https://news.kingscentresouthall.org.uk/"', 'href="/news/"')
    .replaceAll('href="https://news.kingscentresouthall.org.uk/feed.xml"', 'href="/feed.xml"')
    .replaceAll('News articles opened at <a href="/news/">news.kingscentresouthall.org.uk</a> are hosted by Micro.blog.', 'News articles are published by Micro.blog within this website.')
    .replace(/href="([a-z0-9-]+)\.html([#?][^"]*)?"/g, (_m, slug, tail = "") => `href="/${slug}/${tail}"`)
    .replace(/\b(src|poster)="(?!https?:|data:|\/)([^"/]+)"/g, (_m, attr, file) => `${attr}="${publicBase}${file}"`);
}

await mkdir(target, { recursive: true });
for (const page of pages) {
  const slug = basename(page, ".html");
  const sourceHtml = await readFile(join(source, page), "utf8");
  const match = sourceHtml.match(/<main id="main-content">([\s\S]*?)<\/main>/i);
  if (!match) throw new Error(`No main content found in ${page}`);
  const frontMatter = `+++\ntitle = ${JSON.stringify(titles.get(slug) ?? slug)}\ntype = "page"\n+++\n`;
  await writeFile(join(target, `${slug}.html`), frontMatter + migrateLinks(match[1]).trim() + "\n", "utf8");
}

const homeHtml = await readFile(join(source, "index.html"), "utf8");
const homeMatch = homeHtml.match(/<main id="main-content">([\s\S]*?)<\/main>/i);
if (!homeMatch) throw new Error("No main content found in index.html");
let home = migrateLinks(homeMatch[1]);
home = home.replace(/<section class="section cream home-news">[\s\S]*?<\/section>(?=<section class="image-split">)/i, `
<section class="section cream home-news">
  <div class="section-head"><div><p class="eyebrow">Latest news</p><h2>Stories and updates from Southall.</h2></div><p>Follow recent activity across our youth work, training, football academy and local partnerships.</p></div>
  <div class="news-grid">
    {{ range first 3 (where .Site.RegularPages "Type" "post") }}{{ partial "news-card.html" . }}{{ else }}<p>No updates have been published yet.</p>{{ end }}
  </div>
  <p><a class="button teal" href="/news/">See all news →</a></p>
</section>`);
await mkdir(resolve("./layouts/partials"), { recursive: true });
await writeFile(resolve("./layouts/partials/home-content.html"), home.trim() + "\n", "utf8");

console.log(`Imported ${pages.length} pages and the homepage from ${source}`);
