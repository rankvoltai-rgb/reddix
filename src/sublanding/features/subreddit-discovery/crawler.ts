/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { ANATOMY, CHOOSING, EXAMPLE, FAQ, LIST, NEXT, PLANNER } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const tiers = EXAMPLE.tiers
    .map((t) => {
      const rows = EXAMPLE.suggestions
        .filter((s) => s.tier === t.id)
        .map((s) => `<li>r/${esc(s.name)} (${s.score}, ${s.activity} activity, estimate): ${esc(s.reason)}</li>`)
        .join('');
      return `<li><strong>${esc(t.name)}</strong> — ${esc(t.body)}<ul>${rows}</ul></li>`;
    })
    .join('');
  const parts = ANATOMY.parts.map((p) => `<li><strong>${esc(p.label)}:</strong> ${esc(p.body)}</li>`).join('');
  const moments = LIST.moments.map((m) => `<li><strong>${esc(m.when)}: ${esc(m.title)}.</strong> ${esc(m.body)}</li>`).join('');
  const rules = CHOOSING.rules.map((r) => `<li><strong>${esc(r.title)}.</strong> ${esc(r.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const next = NEXT.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join('');
  return `
    <section><p>${esc(EXAMPLE.note)}</p><ul>${tiers}</ul></section>
    <section><h2>${esc(ANATOMY.title)}</h2><p>${esc(ANATOMY.body)}</p><ul>${parts}</ul>
      <p>${esc(ANATOMY.readsTitle)}: ${ANATOMY.reads.map(esc).join(', ')}. <a href="/features/website-analysis">${esc(ANATOMY.readsNote)}</a></p></section>
    <section><h2>${esc(LIST.title)}</h2><ul>${moments}</ul></section>
    <section><h2>${esc(PLANNER.title)}</h2><p>${esc(PLANNER.body)}</p><p>${esc(PLANNER.note)}</p></section>
    <section><h2>${esc(CHOOSING.title)}</h2><ul>${rules}</ul></section>
    <section><h2>Subreddit discovery, answered</h2><dl>${faq}</dl><h3>${esc(NEXT.title)}</h3><ul>${next}</ul></section>
    <section><h2>${esc(NEXT.cta.title)}</h2><p>${esc(NEXT.cta.body)}</p></section>
  `;
}
