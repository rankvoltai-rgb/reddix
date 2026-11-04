// Captures a vendor's pricing page for a roundup, dated the day prices were
// checked, into public/blog as a webp. Rankbox's roundups show the same thing:
// the reader can see the price as it stood.
//
//   npx tsx scripts/blog/screenshot.ts <name> <url> [widthxheight] [waitMs] [selector]
//   npx tsx scripts/blog/screenshot.ts syften-pricing "https://syften.com/?redirect=false" 1440x1300 8000 "#pricing"
//
// `selector` scrolls that element to the top before the capture, for pricing
// that sits partway down a page. Needs Google Chrome, ffmpeg and Node 22+.
// Written to public/blog/<name>-<date>.webp.

import { execFileSync, spawn } from "child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [name, url, size = "1440x1400", wait = "8000", selector] = process.argv.slice(2);
if (!name || !url) {
  console.error("Usage: tsx scripts/blog/screenshot.ts <name> <url> [widthxheight] [waitMs] [selector]");
  process.exit(1);
}
// The local day, which is the date the prices were read.
const date = new Date().toLocaleDateString("en-CA");
const [width, height] = size.split("x").map(Number);
const work = mkdtempSync(join(tmpdir(), "reddix-shot-"));
const profile = join(work, "profile");
const png = join(work, "shot.png");
const out = resolve("public/blog", `${name}-${date}.webp`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  const portFile = join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await sleep(100);
  const port = readFileSync(portFile, "utf8").split("\n")[0];
  const targets = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as {
    type: string;
    webSocketDebuggerUrl: string;
  }[];
  const socket = new WebSocket(targets.find((t) => t.type === "page")!.webSocketDebuggerUrl);
  await new Promise((r) => socket.addEventListener("open", r, { once: true }));

  let nextId = 1;
  const pending = new Map<number, (result: Record<string, unknown>) => void>();
  socket.addEventListener("message", (e) => {
    const m = JSON.parse(String(e.data));
    if (m.id) pending.get(m.id)?.(m.result ?? {});
  });
  const send = (method: string, params: Record<string, unknown> = {}) =>
    new Promise<Record<string, unknown>>((r) => {
      const id = nextId++;
      pending.set(id, r);
      socket.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  await send("Page.navigate", { url });
  await sleep(Number(wait));
  if (selector) {
    await send("Runtime.evaluate", {
      expression: `document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({ block: "start" })`,
    });
    await sleep(2000);
  }
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(png, Buffer.from(String(shot.data), "base64"));
  socket.close();
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-vf", "scale=1200:-2", "-quality", "82", out]);
  console.log(`Saved public/blog/${name}-${date}.webp`);
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(work, { recursive: true, force: true });
}
