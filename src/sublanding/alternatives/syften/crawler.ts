/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CHECKED_LABEL } from '../reddix';
import { CHOOSE, CLOSING, FAQ, HERO, LANES, PLANNER, PLANS, QUESTIONS, SOURCES, SOURCES_WATCHED, SYFTEN_PLANS } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const watched = SOURCES_WATCHED.map(
    (s) => `<li>${esc(s.name)}: ${s.syften === 'yes' ? 'Syften yes' : s.syften === 'addon' ? 'Syften add-on' : 'Syften no'}; Reddix ${s.name === 'Reddit' ? 'yes' : 'no'}${s.note ? ` (${esc(s.note)})` : ''}</li>`,
  ).join('');
  const lane = (steps: { step: string; body: string }[]) => steps.map((s) => `<li><strong>${esc(s.step)}.</strong> ${esc(s.body)}</li>`).join('');
  const plans = SYFTEN_PLANS.map(
    (p) =>
      `<tr><td>${esc(p.name)}</td><td>$${p.price.toFixed(2)}/mo</td><td>${p.filters}</td><td>${p.results}</td><td>${p.webFilters} / ${p.webResults}</td><td>${esc(p.archive)}</td><td>${p.slack ? 'Yes' : 'No'}</td><td>${p.ai ? 'Yes' : 'No'}</td><td>${p.hooks ? 'Yes' : 'No'}</td></tr>`,
  ).join('');
  const list = (items: readonly string[]) => items.map((i) => `<li>${esc(i)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <p>${esc(HERO.answer)}</p>
    <ul>${watched}</ul>
    <section><h2>${esc(QUESTIONS.title)}</h2>
      <h3>Syften asks: “${esc(QUESTIONS.syften.q)}”</h3><p>${esc(QUESTIONS.syften.body)}</p>
      <h3>Reddix asks: “${esc(QUESTIONS.reddix.q)}”</h3><p>${esc(QUESTIONS.reddix.body)}</p></section>
    <section><h2>${esc(LANES.title)}</h2><h3>Syften</h3><ol>${lane(LANES.syften)}</ol><h3>Reddix</h3><ol>${lane(LANES.reddix)}</ol></section>
    <section><h2>${esc(PLANNER.title)}</h2><p>${esc(PLANNER.body)}</p><p>${esc(PLANNER.note)}</p></section>
    <section><h2>${esc(PLANS.title)}</h2><p>${esc(PLANS.body)}</p>
      <table><thead><tr><th>Plan</th><th>Price</th><th>Community filters</th><th>Results a day</th><th>Web filters / results</th><th>Archive</th><th>Slack</th><th>AI filtering</th><th>Webhooks and MCP</th></tr></thead><tbody>${plans}</tbody></table>
      <p>Checked ${CHECKED_LABEL}.</p><p>${esc(PLANS.reddix)}</p></section>
    <section><h2>${esc(CHOOSE.title)}</h2><h3>${esc(CHOOSE.syften.title)}</h3><ul>${list(CHOOSE.syften.items)}</ul><h3>${esc(CHOOSE.reddix.title)}</h3><ul>${list(CHOOSE.reddix.items)}</ul></section>
    <section><h2>Syften and Reddix, answered</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Syften details from its own site, checked ${CHECKED_LABEL}.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p></section>
  `;
}
