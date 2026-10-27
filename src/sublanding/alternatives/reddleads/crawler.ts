/**
 * The page as plain HTML for crawlers that don't run JavaScript: same
 * sections, same order, same words (scripts/prerender.ts).
 */
import { BETTER, CHECKED, CLOSE, DAY, FAQ, NAME, PLANS_TABLE, RL_PLANS, SOURCES, SPLIT, STYLE, TRIAL } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const li = (items: string[]) => items.map((i) => `<li>${esc(i)}</li>`).join('');
  const cols = ['starter', 'pro', 'max', 'premium', 'lifetime'] as const;
  const rows = PLANS_TABLE.rows.map((r) => `<tr><th>${esc(r.label)}</th>${cols.map((c) => `<td>${esc(r[c])}</td>`).join('')}</tr>`).join('');
  return `
    <p>${esc(CHECKED)}, from each vendor’s own pages.</p>
    <section><h2>Same start, different rhythm</h2>
      <h3>${esc(SPLIT.shared.title)}</h3><p>${esc(SPLIT.shared.body)}</p>
      <h3>${esc(SPLIT.them.title)}</h3><p>${esc(SPLIT.them.body)}</p>
      <h3>${esc(SPLIT.reddix.title)}</h3><p>${esc(SPLIT.reddix.body)}</p></section>
    <section><h2>${esc(DAY.title)}</h2><p>${esc(DAY.body)}</p>
      <ul>${Object.values(RL_PLANS).map((p) => `<li>${esc(NAME)} ${esc(p.name)}: scans every ${p.every} minutes${p.alerts ? ', with instant alerts' : ', in-app feed only'}.</li>`).join('')}
      <li>Reddix: scans when you press Scan, at most once every 5 minutes; no alerts.</li></ul>
      <p>${esc(DAY.assumption)}</p></section>
    <section><h2>${esc(STYLE.title)}</h2>
      <h3>${esc(STYLE.them.title)}</h3>${STYLE.them.body.map((p) => `<p>${esc(p)}</p>`).join('')}
      <h3>${esc(STYLE.reddix.title)}</h3>${STYLE.reddix.body.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
    <section><h2>${esc(PLANS_TABLE.title)}</h2><p>${esc(PLANS_TABLE.body)}</p>
      <table><thead><tr><th></th><th>${esc(NAME)} Starter</th><th>${esc(NAME)} Pro</th><th>${esc(NAME)} Max</th><th>Reddix Premium</th><th>Reddix Lifetime</th></tr></thead><tbody>${rows}</tbody></table></section>
    <section><h2>${esc(BETTER.title)}</h2>
      <h3>${esc(BETTER.them.title)}</h3><ul>${li(BETTER.them.items)}</ul>
      <h3>${esc(BETTER.reddix.title)}</h3><ul>${li(BETTER.reddix.items)}</ul></section>
    <section><h2>${esc(TRIAL.title)}</h2><ol>${TRIAL.steps.map((s) => `<li><strong>${esc(s.t)}.</strong> ${esc(s.d)}</li>`).join('')}</ol></section>
    <section><h2>ReddLeads and Reddix, answered</h2><dl>${FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('')}</dl></section>
    <section><h2>Sources</h2><p>${esc(CHECKED)}.</p><ol>${SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('')}</ol></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${CLOSE.related.map((r) => `<li><a href="${r.to}">${esc(r.label)}</a></li>`).join('')}</ul></section>
  `;
}
