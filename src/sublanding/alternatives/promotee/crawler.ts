/**
 * The page as plain HTML for crawlers: same sections, order and words
 * (scripts/prerender.ts).
 */
import { CLOSING, COST, FACTS, FAQ, FIT, HERO, LOOP, PLANNER, PLANS, SOURCES, STRENGTHS, THREAD, TRADE } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const facts = FACTS.items.map((f) => `<li>${esc(f.label)}: ${esc(f.value)} (${esc(f.sub)})</li>`).join('');
  const loop = LOOP.stages
    .map((s) => `<li><strong>${esc(s.name)} (${esc(s.job)}).</strong> ${esc(s.text)} ${s.acts ? 'Acts as your account.' : ''}</li>`)
    .join('');
  const strengths = STRENGTHS.items.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)}</li>`).join('');
  const plans = PLANS.map(
    (p) =>
      `<tr><td>${esc(p.name)}</td><td>$${p.monthly}/month or $${p.annual}/year</td><td>${p.credits.toLocaleString('en-US')} credits</td><td>${p.accounts}</td><td>${
        p.dms ? 'Yes' : 'No'
      }</td></tr>`,
  ).join('');
  const trade = TRADE.rows
    .map((r) => {
      const reddit = r.reddit as { quote?: string; note?: string; where: string };
      return `<li><strong>${esc(r.activity)}.</strong> Promotee: ${esc(r.them)} Reddit: ${reddit.quote ? `“${esc(reddit.quote)}”` : esc(reddit.note ?? '')} (${esc(reddit.where)})</li>`;
    })
    .join('');
  const thread = THREAD.rows.map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.them)}</td><td>${esc(r.us)}</td></tr>`).join('');
  const fit = (side: { name: string; items: readonly string[] }) => `<section><h2>${esc(side.name)}</h2><ul>${side.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`;
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <p>${esc(HERO.checked)}</p>
    <ul>${facts}</ul>
    <section><h2>${esc(LOOP.title)}</h2><p>${esc(LOOP.body)}</p><ol>${loop}</ol></section>
    <section><h2>${esc(STRENGTHS.title)}</h2><p>${esc(STRENGTHS.body)}</p><ul>${strengths}</ul></section>
    <section><h2>${esc(PLANNER.title)}</h2><p>${esc(PLANNER.body)}</p>
      <table><thead><tr><th>Plan</th><th>Price</th><th>Credits a month</th><th>Accounts</th><th>Auto-DMs</th></tr></thead><tbody>${plans}</tbody></table>
      <p>A lead costs ${COST.lead} credit, an AI comment ${COST.comment} and a DM ${COST.dm}. Engage caps AI comments at 10 a day.</p></section>
    <section><h2>${esc(TRADE.title)}</h2><p>${esc(TRADE.body)}</p><ol>${trade}</ol><p>${esc(TRADE.after)}</p></section>
    <section><h2>${esc(THREAD.title)}</h2><table><thead><tr><th></th><th>Promotee</th><th>Reddix</th></tr></thead><tbody>${thread}</tbody></table></section>
    ${fit(FIT.them)}${fit(FIT.us)}
    <section><h2>Promotee or Reddix?</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Every page opened on October 27, 2026.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p></section>
  `;
}
