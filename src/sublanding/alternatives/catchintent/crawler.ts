/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CHECKED_LABEL } from '../reddix';
import { BOTH, CLOSE, COMPARE, EVENTS, EXPLORER, FAQ, GAPS, HERO, LEGACY, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const li = (items: readonly string[]) => items.map((x) => `<li>${esc(x)}</li>`).join('');
  const events = EVENTS.map((e) => `<li><strong>${esc(e.date)}${e.version ? ` (${esc(e.version)})` : ''}:</strong> ${esc(e.text)}</li>`).join('');
  const legacy = LEGACY.items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.body)}</li>`).join('');
  const rows = COMPARE.rows.map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.ci)}</td><td>${esc(r.reddix)}</td></tr>`).join('');
  const gaps = GAPS.items.map((g) => `<li><strong>${esc(g.title)}.</strong> ${esc(g.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}">${esc(s.label)}</a></li>`).join('');
  return `
    <section><h3>${esc(HERO.before.label)}</h3><ul>${li(HERO.before.items)}</ul>
      <h3>${esc(HERO.after.label)}</h3><ul>${li(HERO.after.items)}</ul>
      <p>CatchIntent facts from its own site and changelog, checked ${esc(CHECKED_LABEL)}.</p></section>
    <section><h2>${esc(EXPLORER.title)}</h2><p>${esc(EXPLORER.body)}</p><ol>${events}</ol></section>
    <section><h2>${esc(LEGACY.title)}</h2><p>${esc(LEGACY.body)}</p><ol>${legacy}</ol></section>
    <section><h2>${esc(COMPARE.title)}</h2><p>${esc(COMPARE.body)}</p>
      <table><thead><tr><th></th><th>CatchIntent now</th><th>Reddix</th></tr></thead><tbody>${rows}</tbody></table></section>
    <section><h2>${esc(GAPS.title)}</h2><p>${esc(GAPS.body)}</p><ul>${gaps}</ul><p>${esc(GAPS.same)}</p></section>
    <section><h2>${esc(BOTH.title)}</h2><p>${esc(BOTH.body)}</p></section>
    <section><h2>CatchIntent and Reddit, answered</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Checked ${esc(CHECKED_LABEL)}.</p><ul>${sources}</ul></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><p><a href="/auth">${esc(CLOSE.button)}</a></p></section>
  `;
}
