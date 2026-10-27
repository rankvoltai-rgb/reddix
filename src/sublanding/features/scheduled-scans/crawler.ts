/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { ANATOMY, ANSWER, CLOSE, FAQ, HERO, PLANNER } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const list = (items: string[]) => items.map((i) => `<li>${esc(i)}</li>`).join('');
  const rows = ANATOMY.rows
    .map((r) => {
      const link = 'link' in r && r.link ? ` <a href="${r.link.to}">${esc(r.link.label)}</a>` : '';
      return `<li><strong>${esc(r.title)}</strong> (${esc(r.limit)}): ${esc(r.body)}${link}</li>`;
    })
    .join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const links = CLOSE.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a></li>`).join('');
  return `
    <section><p>${esc(HERO.timeline.scan)}. ${esc(HERO.timeline.rest)}.</p></section>
    <section><h2>${esc(ANSWER.title)}</h2>
      <h3>${esc(ANSWER.does.label)}</h3><ul>${list(ANSWER.does.items)}</ul>
      <h3>${esc(ANSWER.doesnt.label)}</h3><ul>${list(ANSWER.doesnt.items)}</ul>
      <h3>${esc(ANSWER.why.title)}</h3>${ANSWER.why.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
    <section><h2>${esc(ANATOMY.title)}</h2><p>${esc(ANATOMY.body)}</p><ol>${rows}</ol><p>${esc(ANATOMY.footnote)}</p></section>
    <section><h2>${esc(PLANNER.title)}</h2><p>${esc(PLANNER.body)}</p><p>${esc(PLANNER.note)}</p></section>
    <section><h2>Scanning, answered</h2><dl>${faq}</dl></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${links}</ul></section>
  `;
}
