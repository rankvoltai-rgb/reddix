/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CALCULATOR, CHECKED, CLOSING, DIFFERENCES, DMS, FAQ, FORK, GLANCE, PLANS, SOURCES, VERDICT } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const list = (items: readonly string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const rows = GLANCE.rows
    .map((r) => `<tr><th scope="row">${esc(r.label)}</th><td>${esc(r.redreach)}</td><td>${esc(r.reddix)}</td></tr>`)
    .join('');
  const plans = PLANS.plans
    .map((p) => `<tr><td>${esc(p.name)}</td><td>$${p.monthly}/month</td><td>$${p.yearly}/year</td><td>${p.cadence} leads, ${p.replies} reply suggestions, ${p.dms} auto DMs a day, ${p.seats} seat(s), alerts: ${p.alerts.join(', ')}</td></tr>`)
    .join('');
  const diffs = DIFFERENCES.items.map((d) => `<h3>${esc(d.title)}</h3>${d.body.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('');
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <section><p>${esc(FORK.shared)}</p>
      <h3>${esc(FORK.redreach.name)}</h3>${list(FORK.redreach.steps)}
      <h3>${esc(FORK.reddix.name)}</h3>${list(FORK.reddix.steps)}</section>
    <section><h2>${esc(GLANCE.title)}</h2><p>${esc(GLANCE.intro)} Checked ${esc(CHECKED)}.</p>
      <table><thead><tr><th></th><th>Redreach</th><th>Reddix</th></tr></thead><tbody>${rows}</tbody></table></section>
    <section><h2>${esc(DIFFERENCES.title)}</h2>${diffs}</section>
    <section><h2>${esc(DMS.title)}</h2>
      <h3>${esc(DMS.vendor.label)}</h3>${list(DMS.vendor.points)}
      <h3>${esc(DMS.reddit.label)}</h3>${list(DMS.reddit.points)}<p>${esc(DMS.close)}</p></section>
    <section><h2>${esc(CALCULATOR.title)}</h2><p>${esc(CALCULATOR.body)}</p>
      <h3>${esc(PLANS.title)}</h3><table><tbody>${plans}</tbody></table>
      <p>3-day pass: $${PLANS.pass.price}. ${esc(PLANS.pass.note)} ${esc(PLANS.note)}</p></section>
    <section><h2>${esc(VERDICT.title)}</h2>
      <h3>${esc(VERDICT.redreach.label)}</h3>${list(VERDICT.redreach.points)}
      <h3>${esc(VERDICT.reddix.label)}</h3>${list(VERDICT.reddix.points)}</section>
    <section><h2>Redreach and Reddix, answered</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Redreach facts come from its own pages, checked ${esc(CHECKED)}.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p><p><a href="/auth">${esc(CLOSING.button)}</a></p></section>
  `;
}
