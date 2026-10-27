/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CHECKED_LABEL, REDDIX } from '../reddix';
import { BETTER, BOTH, CLOSING, F5_TIERS, FAQ, HERO, INBOX, LOOPS, PRICING, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const loops = LOOPS.rows
    .map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.f5bot)}</td><td>${esc(r.reddix)}</td></tr>`)
    .join('');
  const posts = INBOX.posts.map((p) => `<li>${esc(p.sub)}: “${esc(p.text)}”</li>`).join('');
  const tiers = F5_TIERS.map(
    (t) => `<tr><td>${esc(t.name)}</td><td>${esc(t.price)}</td><td>${esc(t.keywords)}</td><td>${esc(t.alerts)}</td><td>${esc(t.delay)}</td><td>${esc(t.use)}</td></tr>`,
  ).join('');
  const better = BETTER.items.map((b) => `<li><strong>${esc(b.title)}.</strong> ${esc(b.body)}</li>`).join('');
  const both = BOTH.steps.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <p>${esc(HERO.answer)}</p>
    <section><h2>${esc(LOOPS.title)}</h2><p>${esc(LOOPS.body)}</p>
      <table><thead><tr><th></th><th>F5Bot</th><th>Reddix</th></tr></thead><tbody>${loops}</tbody></table></section>
    <section><h2>${esc(INBOX.title)}</h2><p>${esc(INBOX.body)}</p><ul>${posts}</ul><p>${esc(INBOX.note)}</p></section>
    <section><h2>${esc(PRICING.title)}</h2><p>${esc(PRICING.body)}</p>
      <table><thead><tr><th>F5Bot plan</th><th>Price</th><th>Keywords</th><th>Alerts</th><th>Delay</th><th>Use</th></tr></thead><tbody>${tiers}</tbody></table>
      <p>${esc(PRICING.f5Note)} Checked ${CHECKED_LABEL}.</p>
      <h3>${esc(PRICING.reddixTitle)}</h3>
      <ul><li>Premium: $${REDDIX.pricing.premium.price} a month</li><li>Lifetime: $${REDDIX.pricing.lifetime.price} once</li><li>Enterprise: ${esc(REDDIX.pricing.enterprise.note)}</li></ul>
      <p>${esc(PRICING.reddixNote)}</p></section>
    <section><h2>${esc(BETTER.title)}</h2><ul>${better}</ul></section>
    <section><h2>${esc(BOTH.title)}</h2><p>${esc(BOTH.body)}</p><ol>${both}</ol></section>
    <section><h2>F5Bot or Reddix: questions</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>F5Bot details from its own site, checked ${CHECKED_LABEL}.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p></section>
  `;
}
