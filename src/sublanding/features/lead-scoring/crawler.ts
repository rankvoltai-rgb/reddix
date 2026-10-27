/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { ANATOMY, FAQ, HERO, HERO_ROWS, LIFECYCLE, NEXT, SECOND_READ, TRIAGE } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const rows = HERO_ROWS.map((r) => `<li>${esc(r.title)} (${esc(r.subreddit)})</li>`).join("");
  const marks = ANATOMY.marks.map((m) => `<li><strong>${esc(m.title)}</strong> (${esc(m.label)}): ${esc(m.body)}</li>`).join("");
  const list = (items: readonly string[]) => items.map((p) => `<li>${esc(p)}</li>`).join("");
  const steps = LIFECYCLE.steps
    .map((s) => `<li><strong>${esc(s.status)}</strong> — ${esc(s.who)}. ${esc(s.body)}</li>`)
    .join("");
  const a = LIFECYCLE.archived;
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join("");
  const links = NEXT.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join("");
  return `
    <section><ol>${rows}</ol><p>${esc(HERO.caption)}</p></section>
    <section><h2>${esc(ANATOMY.title)}</h2><p>${esc(ANATOMY.body)}</p><ol>${marks}</ol></section>
    <section><h2>${esc(SECOND_READ.title)}</h2><p>${esc(SECOND_READ.body)}</p>
      <h3>${esc(SECOND_READ.before.label)}</h3><ul>${list(SECOND_READ.before.points)}</ul>
      <h3>Analyze</h3><ol>${list(SECOND_READ.steps)}</ol><p>${esc(SECOND_READ.note)}</p>
      <h3>${esc(SECOND_READ.after.label)}</h3><ul>${list(SECOND_READ.after.points)}</ul></section>
    <section><h2>${esc(TRIAGE.title)}</h2><p>${esc(TRIAGE.body)}</p><p>${esc(TRIAGE.note)}</p></section>
    <section><h2>${esc(LIFECYCLE.title)}</h2><p>${esc(LIFECYCLE.body)}</p><ol>${steps}</ol>
      <p><strong>${esc(a.status)}</strong> — ${esc(a.who)}. ${esc(a.body)}</p></section>
    <section><h2>Lead scoring, answered</h2><dl>${faq}</dl>
      <p><a href="/features/intent-detection">How is the 0–100 score worked out? Read intent detection</a></p></section>
    <section><h2>${esc(NEXT.title)}</h2><p>${esc(NEXT.body)}</p><ul>${links}</ul></section>
  `;
}
