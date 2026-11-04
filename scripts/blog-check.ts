// Scores every post in src/content/blog (or the slugs given) against the
// writing guide's SEO checks and blueprint, and exits non-zero if any post
// scores under the bar or fails a blueprint check, then applies the checks in
// scripts/blog-rules.ts to each post and across all of them.
//
//   npm run blog:check                      every post
//   npm run blog:check -- find-customers-on-reddit
//
// See docs/blog/writing-guide.md for what each check asks for.

import { existsSync } from "fs";
import { resolve } from "path";
import { readAllPosts } from "./blog-files";
import { scorePost, type Check } from "../src/lib/blog/score";
import { todayUTC } from "../src/lib/blog/posts";
import { acrossFindings, postFindings } from "./blog-rules";

const BAR = 100;
const ICON = { pass: "✓", warn: "!", fail: "✗" } as const;

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const everyPost = readAllPosts();
const slugs = new Set(everyPost.map((p) => p.slug));
const posts = everyPost.filter((p) => !only.length || only.includes(p.slug));
if (!posts.length) {
  console.error(only.length ? `No post matches: ${only.join(", ")}` : "No posts in src/content/blog.");
  process.exit(1);
}

const line = (c: Check) => `   ${ICON[c.status]} ${c.label.padEnd(26)} ${c.detail}`;
let failed = 0;

for (const post of posts) {
  const s = scorePost(post);
  const hasImage = existsSync(resolve("public/og/blog", `${post.slug}.jpg`));
  s.blueprint.push({
    label: "Social image",
    weight: 0,
    status: hasImage ? "pass" : "fail",
    detail: hasImage ? `public/og/blog/${post.slug}.jpg` : "Run `npx tsx scripts/og/render.ts` to create it.",
  });
  const blueprintFail = s.blueprint.some((c) => c.status === "fail");
  const findings = postFindings(post, slugs);
  const ok = s.score >= BAR && !blueprintFail && !findings.length;
  if (!ok) failed++;
  const when = post.date > todayUTC() ? ` · scheduled for ${post.date}` : "";
  console.log(`\n${ok ? "PASS" : "FAIL"}  ${post.slug}  —  score ${s.score}/100 · ${s.words} words · ${post.readingMinutes} min${when}`);
  console.log("  SEO checks");
  s.checks.forEach((c) => console.log(line(c)));
  console.log("  Blueprint");
  s.blueprint.forEach((c) => console.log(line(c)));
  if (findings.length) {
    console.log("  Rules");
    findings.forEach((f) => console.log(`   ${ICON.fail} ${f.label.padEnd(26)} ${f.detail}`));
  }
}

// Every post against every other, whichever ones were asked for.
const across = acrossFindings(everyPost);
if (across.length) {
  console.log("\nAcross posts");
  across.forEach((f) => console.log(`   ${ICON.fail} ${f.label.padEnd(26)} ${f.detail}`));
  failed++;
}

console.log(`\n${posts.length - failed}/${posts.length} posts ready (bar: ${BAR}/100, no blueprint failures).`);
process.exit(failed ? 1 : 0);
