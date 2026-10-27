// Renders social preview images (1200×630) with headless Chrome from
// scripts/og/og.html, then encodes them as JPEG with ffmpeg:
//
//   public/og/default.jpg          every page without its own image
//   public/og/blog.jpg             the blog index
//   public/og/blog/<slug>.jpg      one per post
//
//   npx tsx scripts/og/render.ts            render missing post images
//   npx tsx scripts/og/render.ts --all      re-render everything
//
// Lovable's build can't run Chrome, so the images are committed; run this
// after adding a post (prerender points each post at its image when it exists).

import { execFileSync } from "child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { pathToFileURL } from "url";
import { readAllPosts } from "../blog-files";

const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TEMPLATE = pathToFileURL(resolve("scripts/og/og.html")).href;
const OUT = resolve("public/og");
const all = process.argv.includes("--all");

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME} (set CHROME=/path/to/chrome)`);
  process.exit(1);
}
mkdirSync(join(OUT, "blog"), { recursive: true });

const work = mkdtempSync(join(tmpdir(), "reddix-og-"));

function render(out: string, params: Record<string, string>) {
  if (!all && existsSync(out)) return false;
  const png = join(work, "shot.png");
  const url = `${TEMPLATE}?${new URLSearchParams(params)}`;
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      "--virtual-time-budget=8000",
      "--allow-file-access-from-files",
      `--user-data-dir=${join(work, "profile")}`,
      `--screenshot=${png}`,
      url,
    ],
    { stdio: "ignore" },
  );
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", png, "-q:v", "3", out]);
  return true;
}

let n = 0;
if (render(join(OUT, "default.jpg"), { title: "Find warm leads on Reddit, and reply without getting banned", eyebrow: "AI Reddit lead generation" })) n++;
if (render(join(OUT, "blog.jpg"), { title: "Turn Reddit into a customer channel", eyebrow: "The Reddix blog" })) n++;
for (const post of readAllPosts()) {
  const subtitle = `<b>reddix.info/blog</b> · ${post.readingMinutes} min read`;
  if (render(join(OUT, "blog", `${post.slug}.jpg`), { title: post.title, eyebrow: post.tags[0] || "Blog", subtitle })) n++;
}

rmSync(work, { recursive: true, force: true });
console.log(`og: rendered ${n} image${n === 1 ? "" : "s"} into public/og`);
