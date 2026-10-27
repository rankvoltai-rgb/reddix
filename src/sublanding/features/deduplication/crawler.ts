/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CLOSE, FAQ, HERO, LAYERS, LEDGER, LIMITS, REPLAY } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const list = (items: string[]) => items.map((i) => `<li>${esc(i)}</li>`).join('');
  const layers = LAYERS.items.map((l) => `<li><strong>${esc(l.title)}.</strong> ${esc(l.body)}</li>`).join('');
  const limits = LIMITS.items.map((l) => `<li><strong>${esc(l.title)}.</strong> ${esc(l.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const links = CLOSE.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join('');
  return `
    <section><p>${esc(HERO.merge.stamp)}.</p></section>
    <section><h2>${esc(LAYERS.title)}</h2><p>${esc(LAYERS.body)}</p><ol>${layers}</ol></section>
    <section><h2>${esc(REPLAY.title)}</h2><p>${esc(REPLAY.body)}</p><p>${esc(REPLAY.note)}</p></section>
    <section><h2>${esc(LEDGER.title)}</h2>
      <h3>${esc(LEDGER.remembered.label)}</h3><ul>${list(LEDGER.remembered.items)}</ul>
      <h3>${esc(LEDGER.again.label)}</h3><ul>${list(LEDGER.again.items)}</ul>
      <p>${esc(LEDGER.footnote)}</p></section>
    <section><h2>${esc(LIMITS.title)}</h2><ul>${limits}</ul></section>
    <section><h2>Duplicates, answered</h2><dl>${faq}</dl></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${links}</ul></section>
  `;
}
