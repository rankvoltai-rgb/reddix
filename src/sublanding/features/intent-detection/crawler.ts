/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { BANDS, CHECKER, FAQ, INTENTS, LIMITS, NEXT, STAGES } from './content';
import { POINTS } from './signals';

export function crawlerBody(esc: (s: string) => string): string {
  const posts = INTENTS.posts
    .map((p) => `<li><strong>${esc(p.level)} (${p.score}):</strong> “${esc(p.text)}” ${esc(p.why)}</li>`)
    .join("");
  const steps = STAGES.steps
    .map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)} (${s.facts.map(esc).join("; ")})</li>`)
    .join("");
  const bands = BANDS.bands
    .map((b) => `<tr><td>${esc(b.name)}</td><td>${b.range[0]}–${b.range[1]}</td><td>${esc(b.looks)}</td><td>${esc(b.act)}</td></tr>`)
    .join("");
  const boosts = BANDS.boosts.map((b) => `<li>+${POINTS[b.key]} — ${esc(b.name)}: ${esc(b.example)}</li>`).join("");
  const limits = LIMITS.items.map((l) => `<li><strong>${esc(l.title)}.</strong> ${esc(l.body)}</li>`).join("");
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join("");
  const next = NEXT.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join("");
  return `
    <section><h2>${esc(INTENTS.title)}</h2><p>${esc(INTENTS.body)}</p><ul>${posts}</ul><p>${esc(INTENTS.note)}</p></section>
    <section><h2>${esc(STAGES.title)}</h2><p>${esc(STAGES.body)}</p><ol>${steps}</ol></section>
    <section><h2>${esc(BANDS.title)}</h2><p>${esc(BANDS.body)}</p>
      <table><thead><tr><th>Level</th><th>Score</th><th>Usually</th><th>What to do</th></tr></thead><tbody>${bands}</tbody></table>
      <h3>${esc(BANDS.boostsTitle)}</h3><ul>${boosts}</ul><p>${esc(BANDS.boostsNote)}</p></section>
    <section><h2>${esc(CHECKER.title)}</h2><p>${esc(CHECKER.body)}</p></section>
    <section><h2>${esc(LIMITS.title)}</h2><ul>${limits}</ul></section>
    <section><h2>Intent detection, answered</h2><dl>${faq}</dl></section>
    <section><h2>${esc(NEXT.title)}</h2><ul>${next}</ul></section>
  `;
}
