/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { BADGES, COUNTS, FAQ, HERO, NEXT, NOT_HERE, SANDBOX, STATES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const rows = COUNTS.rows
    .map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.counts)}</td><td>${esc(r.includes)}</td><td>${esc(r.excludes)}</td></tr>`)
    .join("");
  const states = STATES.states
    .map((s) => `<li><strong>When: ${esc(s.when)}</strong> — ${esc(s.title)}. ${esc(s.body)}</li>`)
    .join("");
  const badges = BADGES.list.map((b) => `<li>${esc(b.name)}: ${b.threshold} engaged lead${b.threshold > 1 ? "s" : ""}</li>`).join("");
  const limits = NOT_HERE.items.map((l) => `<li><strong>${esc(l.title)}.</strong> ${esc(l.body)}</li>`).join("");
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join("");
  const links = NEXT.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join("");
  return `
    <section><p>${esc(HERO.caption)}</p></section>
    <section><h2>${esc(COUNTS.title)}</h2><p>${esc(COUNTS.body)}</p>
      <table><thead><tr><th>Figure</th><th>Counts</th><th>Includes</th><th>Leaves out</th></tr></thead><tbody>${rows}</tbody></table></section>
    <section><h2>${esc(STATES.title)}</h2><p>${esc(STATES.body)}</p><ol>${states}</ol></section>
    <section><h2>${esc(SANDBOX.title)}</h2><p>${esc(SANDBOX.body)}</p><p>${esc(SANDBOX.note)}</p></section>
    <section><h2>${esc(BADGES.title)}</h2><p>${esc(BADGES.body)}</p><ol>${badges}</ol></section>
    <section><h2>${esc(NOT_HERE.title)}</h2><ul>${limits}</ul></section>
    <section><h2>Dashboard questions</h2><dl>${faq}</dl></section>
    <section><h2>${esc(NEXT.title)}</h2><p>${esc(NEXT.body)}</p><ul>${links}</ul></section>
  `;
}
