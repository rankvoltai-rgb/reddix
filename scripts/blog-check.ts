// Scores every post in src/content/blog (or the slugs given) against the
// writing guide's SEO checks and blueprint, and exits non-zero if any post
// scores under the bar or fails a blueprint check.
//
//   npm run blog:check                      every post
//   npm run blog:check -- find-customers-on-reddit
//
// See docs/blog/writing-guide.md for what each check asks for.

import { readAllPosts } from "./blog-files";
import { scorePost, type Check } from "../src/lib/blog/score";
import { todayUTC } from "../src/lib/blog/posts";

const BAR = 90;
const ICON = { pass: "✓", warn: "!", fail: "✗" } as const;

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const posts = readAllPosts().filter((p) => !only.length || only.includes(p.slug));
if (!posts.length) {
  console.error(only.length ? `No post matches: ${only.join(", ")}` : "No posts in src/content/blog.");
  process.exit(1);
}

const line = (c: Check) => `   ${ICON[c.status]} ${c.label.padEnd(26)} ${c.detail}`;
let failed = 0;

for (const post of posts) {
  const s = scorePost(post);
  const blueprintFail = s.blueprint.some((c) => c.status === "fail");
  const ok = s.score >= BAR && !blueprintFail;
  if (!ok) failed++;
  const when = post.date > todayUTC() ? ` · scheduled for ${post.date}` : "";
  console.log(`\n${ok ? "PASS" : "FAIL"}  ${post.slug}  —  score ${s.score}/100 · ${s.words} words · ${post.readingMinutes} min${when}`);
  console.log("  SEO checks");
  s.checks.forEach((c) => console.log(line(c)));
  console.log("  Blueprint");
  s.blueprint.forEach((c) => console.log(line(c)));
}

console.log(`\n${posts.length - failed}/${posts.length} posts ready (bar: ${BAR}/100, no blueprint failures).`);
process.exit(failed ? 1 : 0);
