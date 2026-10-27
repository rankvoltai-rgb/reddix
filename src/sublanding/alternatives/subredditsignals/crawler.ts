/**
 * The page as plain HTML for crawlers that don't run JavaScript: same
 * sections, same order, same words (scripts/prerender.ts).
 */
import { BETTER, CHECKED, CLOSE, DELIVERY, FAQ, FIT, NAME, OVERLAP, PRICING, SCORING, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const li = (items: string[]) => items.map((i) => `<li>${esc(i)}</li>`).join('');
  const rows = PRICING.rows
    .map(
      (r) =>
        `<tr><td>${esc(r.who === 'reddix' ? 'Reddix' : NAME)} ${esc(r.plan)}</td><td>${esc(r.price)}</td><td>$${r.year.toLocaleString('en-US')} (${esc(r.yearNote)})</td><td>${esc(r.limits)}</td></tr>`,
    )
    .join('');
  const needs = FIT.needs
    .map((n) => `<li><strong>${esc(n.label)}</strong> — ${esc(NAME)}: ${esc(n.them.text)} Reddix: ${esc(n.reddix.text)}</li>`)
    .join('');
  const lane = (l: typeof DELIVERY.them) =>
    `<h3>${esc(l.name)}</h3><ol>${l.steps.map((s) => `<li>${esc(s.label)}. ${esc(s.detail)}</li>`).join('')}</ol>`;
  return `
    <p>${esc(CHECKED)}, from each vendor’s own pages.</p>
    <section><h2>What overlaps and what doesn’t</h2>
      <h3>${esc(OVERLAP.left.title)}</h3><ul>${li(OVERLAP.left.items)}</ul>
      <h3>${esc(OVERLAP.both.title)}</h3><ul>${li(OVERLAP.both.items)}</ul>
      <h3>${esc(OVERLAP.right.title)}</h3><ul>${li(OVERLAP.right.items)}</ul></section>
    <section><h2>${esc(SCORING.title)}</h2><p>${esc(SCORING.body)}</p>
      <h3>${esc(SCORING.them.name)}</h3><p>${esc(SCORING.them.lead)} ${esc(SCORING.them.dimensions.join(', '))}.</p><ul>${li(SCORING.them.points)}</ul><p>${esc(SCORING.them.note)}</p>
      <h3>${esc(SCORING.reddix.name)}</h3><p>${esc(SCORING.reddix.lead)}</p><ul>${li(SCORING.reddix.points)}</ul><p>${esc(SCORING.reddix.note)} <a href="${SCORING.reddix.link.to}">${esc(SCORING.reddix.link.label)}</a></p></section>
    <section><h2>${esc(DELIVERY.title)}</h2><p>${esc(DELIVERY.body)}</p>${lane(DELIVERY.them)}${lane(DELIVERY.reddix)}<p>${esc(DELIVERY.takeaway)}</p></section>
    <section><h2>${esc(PRICING.title)}</h2><p>${esc(PRICING.body)}</p>
      <table><thead><tr><th>Plan</th><th>List price</th><th>One year</th><th>What you get</th></tr></thead><tbody>${rows}</tbody></table>
      <ul>${PRICING.trials.map((t) => `<li>${esc(t.who)}: ${esc(t.text)}</li>`).join('')}</ul>
      <h3>${esc(PRICING.caveatTitle)}</h3><p>${esc(PRICING.caveat)}</p></section>
    <section><h2>${esc(FIT.title)}</h2><p>${esc(FIT.body)}</p><ul>${needs}</ul></section>
    <section><h2>${esc(BETTER.title)}</h2>
      <h3>${esc(BETTER.them.title)}</h3><ol>${li(BETTER.them.items)}</ol>
      <h3>${esc(BETTER.reddix.title)}</h3><ol>${li(BETTER.reddix.items)}</ol></section>
    <section><h2>Subreddit Signals or Reddix: questions</h2><dl>${FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('')}</dl></section>
    <section><h2>Sources</h2><p>${esc(CHECKED)}.</p><ol>${SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('')}</ol></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${CLOSE.related.map((r) => `<li><a href="${r.to}">${esc(r.label)}</a></li>`).join('')}</ul></section>
  `;
}
