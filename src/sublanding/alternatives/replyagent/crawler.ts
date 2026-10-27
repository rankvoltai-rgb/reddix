/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { BUDGET, CHECKED, CLOSING, CONFLICTS, FAQ, FIT, LANES, MODES, RULES, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const list = (items: readonly string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const lanes = [LANES.you, LANES.them].map((l) => `<h2>${esc(l.title)}</h2><p>${esc(l.who)}</p>${list(l.points)}`).join('');
  const modes = MODES.items.map((m) => `<h3>${esc(m.name)}: ${esc(m.price)}</h3><p>${esc(m.body)}</p>`).join('');
  const fit = FIT.points.map((p) => `<li><strong>${esc(p.title)}.</strong> ${esc(p.body)}</li>`).join('');
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  const rates = BUDGET.rates.map((r) => `${r.label} (${esc(r.note)})`).join('; ');
  return `
    <section><p>ReplyAgent facts checked ${esc(CHECKED)}.</p>${lanes}</section>
    <section><h2>${esc(MODES.title)}</h2>${modes}<p>${esc(MODES.reddix)}</p></section>
    <section><h2>${esc(RULES.title)}</h2>
      <h3>${esc(RULES.vendor.label)}</h3>${list(RULES.vendor.points)}
      <h3>${esc(RULES.reddit.label)}</h3>${list(RULES.reddit.points)}<p>${esc(RULES.close)}</p></section>
    <section><h2>${esc(BUDGET.title)}</h2><p>${esc(BUDGET.body)}</p><p>Posting prices listed: ${esc(rates)}. Refund: 70% on content removed at the check. ${esc(BUDGET.removalNote)}</p></section>
    <section><h2>${esc(FIT.title)}</h2><ul>${fit}</ul></section>
    <section><h2>${esc(CONFLICTS.title)}</h2><p>${esc(CONFLICTS.intro)}</p>${list(CONFLICTS.items)}</section>
    <section><h2>ReplyAgent or Reddix: questions</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Checked ${esc(CHECKED)}.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p><p><a href="/auth">${esc(CLOSING.button)}</a></p></section>
  `;
}
