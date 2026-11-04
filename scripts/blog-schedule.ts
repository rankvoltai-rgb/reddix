/**
 * The blog scheduler: gives every written-but-unpublished post in
 * src/content/blog a go-live date, then regenerates src/lib/blog/schedule.ts.
 *
 *   npm run blog:schedule                   date new posts; booked dates stay put
 *   npm run blog:schedule -- --dry-run      show the plan, change nothing
 *   npm run blog:schedule -- --first a,b    put these posts at the front of the queue
 *   npm run blog:schedule -- --reshuffle    re-plan every post that isn't live yet
 *
 * Each post is in one of three states:
 *   live    on origin/main with a date that has come. Never moved.
 *   booked  dated after today. Keeps its date (unless --reshuffle).
 *   queued  anything else: a new post, still dated the day it was written.
 *
 * Queued posts take free slots from tomorrow on, following
 * src/lib/blog/cadence.ts: a cluster's `hub: true` post first, posts from one
 * `cluster:` CLUSTER_GAP_DAYS apart. A `pin: YYYY-MM-DD` post goes on that day.
 * A queued post keeps the day it was written as `written:`, and its `date:` and
 * `updated:` become the go-live day, which is the date readers see.
 *
 * Reddix is prerendered at build, so a post flips live in the app on its day,
 * but reaches the sitemap, RSS and crawler HTML at the next push and Publish.
 */
import { execFileSync } from "child_process";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  CLUSTER_GAP_DAYS,
  MAX_PER_DAY,
  MAX_PER_WEEK,
  POSTS_PER_WEEKDAY,
  SCHEDULE_START,
  STALE_AFTER_DAYS,
} from "../src/lib/blog/cadence";

const BLOG_DIR = "src/content/blog";
const SCHEDULE_FILE = "src/lib/blog/schedule.ts";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const reshuffle = args.includes("--reshuffle");
const firstAt = args.indexOf("--first");
const first = firstAt >= 0 ? (args[firstAt + 1] ?? "").split(",").filter(Boolean) : [];

/* ---------- days, as YYYY-MM-DD in UTC ---------- */

const DAY_MS = 86_400_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const msOf = (day: string) => Date.parse(`${day}T00:00:00Z`);
const dayOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const addDays = (day: string, n: number) => dayOf(msOf(day) + n * DAY_MS);
const daysBetween = (a: string, b: string) => Math.round((msOf(b) - msOf(a)) / DAY_MS);
const weekday = (day: string) => new Date(msOf(day)).getUTCDay();

const today = dayOf(Date.now());
const start = [addDays(today, 1), SCHEDULE_START].sort()[1];

/* ---------- posts ---------- */

interface Post {
  slug: string;
  path: string;
  raw: string;
  date: string;
  written: string;
  cluster: string;
  hub: boolean;
  pin?: string;
}

function field(raw: string, key: string): string | undefined {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1] ?? "";
  return new RegExp(`^${key}:[ \\t]*(.*)$`, "m").exec(frontmatter)?.[1].trim() || undefined;
}

/** The post's frontmatter with `date`/`updated` set to the go-live day and `written` kept. */
function redate(raw: string, date: string, written: string): string {
  const end = raw.indexOf("\n---", 3);
  const head = raw
    .slice(0, end)
    .replace(/^date:.*$/m, `date: ${date}`)
    .replace(/^updated:.*$/m, `updated: ${date}`)
    .replace(/^written:.*\n?/m, "")
    .replace(/^updated:.*$/m, (line) => `${line}\nwritten: ${written}`);
  return head + raw.slice(end);
}

const posts: Post[] = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const path = join(BLOG_DIR, f);
    const raw = readFileSync(path, "utf8");
    const slug = f.replace(/\.md$/, "");
    const date = field(raw, "date") ?? today;
    return {
      slug,
      path,
      raw,
      date,
      written: field(raw, "written") ?? date,
      cluster: field(raw, "cluster") ?? slug,
      hub: field(raw, "hub") === "true",
      pin: field(raw, "pin"),
    };
  });
const bySlug = new Map(posts.map((p) => [p.slug, p]));

/** Slugs of the posts on origin/main, which is what production builds from. */
function published(): Set<string> {
  try {
    execFileSync("git", ["fetch", "--quiet", "origin", "main"], {
      stdio: "ignore",
      timeout: 20_000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
  } catch {
    console.warn("! git fetch failed, so this uses the last fetched origin/main.\n");
  }
  const files = execFileSync("git", ["ls-tree", "-r", "--name-only", "origin/main", "--", BLOG_DIR], {
    encoding: "utf8",
  });
  return new Set(
    files
      .split("\n")
      .filter(Boolean)
      .map((f) => f.split("/").pop()!.replace(/\.md$/, "")),
  );
}

const onMain = published();
const isLive = (p: Post) => onMain.has(p.slug) && p.date <= today;
const isBooked = (p: Post) => !isLive(p) && p.date > today && !reshuffle;

/* ---------- the calendar ---------- */

const dates = new Map<string, string>(); // slug → go-live day, for live, booked and newly dated posts
const perDay = new Map<string, number>();
function place(slug: string, day: string) {
  dates.set(slug, day);
  if (day >= SCHEDULE_START) perDay.set(day, (perDay.get(day) ?? 0) + 1);
}
for (const p of posts) if (isLive(p) || isBooked(p)) place(p.slug, p.date);

const count = (day: string) => perDay.get(day) ?? 0;

/** Room for one more on `day` in every seven-day window that contains it. */
function weekHasRoom(day: string): boolean {
  for (let s = -6; s <= 0; s++) {
    let total = 1;
    for (let d = 0; d < 7; d++) total += count(addDays(day, s + d));
    if (total > MAX_PER_WEEK) return false;
  }
  return true;
}

function canGo(p: Post, day: string): boolean {
  const hub = posts.find((h) => h.hub && h.cluster === p.cluster && h.slug !== p.slug);
  if (hub) {
    const hubDay = dates.get(hub.slug);
    if (!hubDay || hubDay >= day) return false;
  }
  for (const [slug, d] of dates) {
    if (
      slug !== p.slug &&
      bySlug.get(slug)?.cluster === p.cluster &&
      Math.abs(daysBetween(d, day)) < CLUSTER_GAP_DAYS
    ) {
      return false;
    }
  }
  return true;
}

const rank = (p: Post) => {
  const pinned = first.indexOf(p.slug);
  return [pinned >= 0 ? String(pinned).padStart(4, "0") : "9999", p.hub ? "0" : "1", p.written, p.slug];
};
const byRank = (a: Post, b: Post) => {
  const [x, y] = [rank(a), rank(b)];
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
};

for (const slug of first) if (!bySlug.has(slug)) console.warn(`! --first: no post called ${slug}`);
const waiting = posts.filter((p) => !isLive(p) && !isBooked(p));
const newlyDated: Post[] = [];

// Pinned posts take their day first, so the rest space themselves around them.
for (const p of waiting) {
  if (p.pin && p.pin > today) {
    place(p.slug, p.pin);
    newlyDated.push(p);
  }
}

const queue = waiting.filter((p) => !dates.has(p.slug)).sort(byRank);
for (let day = start; queue.length > 0; day = addDays(day, 1)) {
  if (daysBetween(start, day) > 3 * 365) throw new Error("No room in three years; check src/lib/blog/cadence.ts.");
  let free = Math.min(POSTS_PER_WEEKDAY[weekday(day)], MAX_PER_DAY) - count(day);
  while (free > 0 && weekHasRoom(day)) {
    const i = queue.findIndex((p) => canGo(p, day));
    if (i < 0) break;
    const [p] = queue.splice(i, 1);
    place(p.slug, day);
    newlyDated.push(p);
    free--;
  }
}

/* ---------- write ---------- */

if (!dryRun) {
  for (const p of newlyDated) writeFileSync(p.path, redate(p.raw, dates.get(p.slug)!, p.written));
  const entries = posts
    .map((p) => [p.slug, dates.get(p.slug) ?? p.date] as const)
    .filter(([, d]) => d >= SCHEDULE_START)
    .sort(([a, x], [b, y]) => x.localeCompare(y) || a.localeCompare(b));
  const body = entries.length
    ? `{\n${entries.map(([s, d]) => `  ${JSON.stringify(s)}: ${JSON.stringify(d)},`).join("\n")}\n}`
    : "{}";
  const current = readFileSync(SCHEDULE_FILE, "utf8");
  writeFileSync(
    SCHEDULE_FILE,
    current.replace(/export const BLOG_SCHEDULE: Record<string, string> = \{[\s\S]*?\};/, `export const BLOG_SCHEDULE: Record<string, string> = ${body};`),
  );
}

/* ---------- report ---------- */

const upcoming = [...dates]
  .filter(([, d]) => d > today)
  .sort(([a, x], [b, y]) => x.localeCompare(y) || a.localeCompare(b));
const fresh = new Set(newlyDated.map((p) => p.slug));
let lastWeek = "";
for (const [slug, day] of upcoming) {
  const week = addDays(day, -((weekday(day) + 6) % 7));
  if (week !== lastWeek) console.log(`\nWeek of ${week}`);
  lastWeek = week;
  const p = bySlug.get(slug)!;
  const wait = daysBetween(p.written, day);
  const notes = [
    fresh.has(slug) ? "new" : "",
    p.pin ? "pinned" : "",
    p.hub ? "hub" : "",
    wait > STALE_AFTER_DAYS ? `re-check facts: written ${p.written}, ${wait} days before` : "",
  ].filter(Boolean);
  console.log(`  ${WEEKDAYS[weekday(day)]} ${day}  ${slug}${notes.length ? `  (${notes.join(", ")})` : ""}`);
}
const live = posts.filter(isLive).length;
console.log(
  `\n${live} live, ${upcoming.length} scheduled (${newlyDated.length} newly dated)` +
    (upcoming.length ? `, reserve runs to ${upcoming.at(-1)![1]}` : "") +
    (dryRun ? ". Dry run: nothing written." : "."),
);
