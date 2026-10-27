/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CHECKED_LABEL } from '../reddix';
import { ALREADY, ARRIVAL, ARRIVAL_TAIL_HOURS, BUYERS, CLOCK, CLOSING, DOSSIER, FAQ, HERO, RIGHT_CHOICE, SOURCES, TIMELINE } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const dossier = DOSSIER.map((d) => `<li><strong>${esc(d.k)}:</strong> ${esc(d.v)}</li>`).join('');
  const buyers = BUYERS.rows.map((r) => `<tr><th>${esc(r.k)}</th><td>${esc(r.brandwatch)}</td><td>${esc(r.reddix)}</td></tr>`).join('');
  const events = TIMELINE.events.map((e) => `<li><strong>${esc(e.when)}:</strong> ${esc(e.what)}</li>`).join('');
  const removed = TIMELINE.removed.map((f) => `<li>${esc(f)}</li>`).join('');
  const arrival = ARRIVAL.map((p) => `<li>Within ${p.hours} hour${p.hours > 1 ? 's' : ''}: about ${p.share}%</li>`).join('');
  const right = RIGHT_CHOICE.items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <p>${esc(HERO.answer)}</p>
    <p><strong>Brandwatch at a glance (checked ${CHECKED_LABEL})</strong></p><ul>${dossier}</ul>
    <section><h2>${esc(BUYERS.title)}</h2><p>${esc(BUYERS.body)}</p>
      <table><thead><tr><th></th><th>Brandwatch</th><th>Reddix</th></tr></thead><tbody>${buyers}</tbody></table></section>
    <section><h2>${esc(TIMELINE.title)}</h2><p>${esc(TIMELINE.body)}</p><ol>${events}</ol>
      <h3>${esc(TIMELINE.removedTitle)}</h3><ul>${removed}</ul><p>${esc(TIMELINE.kept)}</p></section>
    <section><h2>${esc(CLOCK.title)}</h2><p>${esc(CLOCK.body)}</p>
      <ul>${arrival}<li>Some content: up to about ${ARRIVAL_TAIL_HOURS} hours</li></ul><p>${esc(CLOCK.reddix)}</p><p>${esc(CLOCK.note)}</p></section>
    <section><h2>${esc(RIGHT_CHOICE.title)}</h2><ul>${right}</ul></section>
    <section><h2>${esc(ALREADY.title)}</h2><p>${esc(ALREADY.body)}</p></section>
    <section><h2>Brandwatch, Reddit and Reddix: questions</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Checked ${CHECKED_LABEL}.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p></section>
  `;
}
