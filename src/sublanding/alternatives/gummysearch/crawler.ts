/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts). The
 * live day count is left out; the dates it counts to are not.
 */
import { CHECKED_LABEL } from '../reddix';
import { CHECKLIST, CLOSE, FAQ, FIT, MAPPING, PHASES, PRICES, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const phases = PHASES.phases.map((p) => `<li><strong>${esc(p.label)}: ${esc(p.title)}.</strong> ${esc(p.body)}</li>`).join('');
  const steps = CHECKLIST.items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.body)} ${esc(i.next)}</li>`).join('');
  const rows = MAPPING.rows
    .map((r) => `<tr><td><strong>${esc(r.gummy)}</strong>: ${esc(r.what)}</td><td>${esc(MAPPING.legend[r.verdict])}</td><td>${esc(r.reddix)}</td></tr>`)
    .join('');
  const list = (items: { name: string; price: string; note: string }[]) =>
    items.map((p) => `<li>${esc(p.name)}: ${esc(p.price)} (${esc(p.note)})</li>`).join('');
  const li = (items: readonly string[]) => items.map((x) => `<li>${esc(x)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}">${esc(s.label)}</a></li>`).join('');
  return `
    <p>GummySearch facts checked ${esc(CHECKED_LABEL)}.</p>
    <section><h2>${esc(PHASES.title)}</h2><p>${esc(PHASES.body)}</p><ol>${phases}</ol></section>
    <section><h2>${esc(CHECKLIST.title)}</h2><p>${esc(CHECKLIST.body)}</p><ol>${steps}</ol></section>
    <section><h2>${esc(MAPPING.title)}</h2><p>${esc(MAPPING.body)}</p>
      <table><thead><tr><th>In GummySearch</th><th>In Reddix</th><th>How Reddix handles it</th></tr></thead><tbody>${rows}</tbody></table></section>
    <section><h2>${esc(PRICES.title)}</h2><p>${esc(PRICES.body)}</p>
      <h3>GummySearch, no longer sold</h3><ul>${list(PRICES.gummy)}</ul><h3>Reddix</h3><ul>${list(PRICES.reddix)}</ul><p>${esc(PRICES.footnote)}</p></section>
    <section><h2>${esc(FIT.title)}</h2><h3>${esc(FIT.move.title)}…</h3><ul>${li(FIT.move.items)}</ul>
      <h3>${esc(FIT.elsewhere.title)}…</h3><ul>${li(FIT.elsewhere.items)}</ul><p>${esc(FIT.elsewhere.note)}</p></section>
    <section><h2>GummySearch’s shutdown, answered</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><p><a href="/auth">${esc(CLOSE.button)}</a></p></section>
  `;
}
