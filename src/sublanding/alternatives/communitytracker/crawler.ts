/**
 * The page as plain HTML for crawlers that don't run JavaScript: same
 * sections, same order, same words (scripts/prerender.ts).
 */
import { CALC, CHECKED, CLOSE, COVERAGE, FAQ, FITS, JOBS, LADDER, NAME, PLANS, PLATFORMS, REDDIX_YEAR, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const li = (items: string[]) => items.map((i) => `<li>${esc(i)}</li>`).join('');
  const planName = (id: string) => PLANS.find((p) => p.id === id)?.name ?? id;
  const flow = (j: typeof JOBS.them) =>
    `<h3>${esc(j.name)}</h3><p>${esc(j.lead)}</p><ol>${j.steps.map((s) => `<li><strong>${esc(s.t)}.</strong> ${esc(s.d)}</li>`).join('')}</ol><p>${esc(j.footnote)}</p>`;
  return `
    <p>${esc(CHECKED)}, from each vendor’s own pages.</p>
    <section><h2>Coverage</h2>
      <h3>${esc(COVERAGE.them.label)}</h3><ul>${PLATFORMS.map((p) => `<li>${esc(p.name)} (from ${esc(planName(p.from))})</li>`).join('')}</ul><p>${esc(COVERAGE.them.note)}</p>
      <h3>${esc(COVERAGE.reddix.label)}</h3><p>${esc(COVERAGE.reddix.note)}</p><ul>${li(COVERAGE.reddix.depth)}</ul></section>
    <section><h2>${esc(JOBS.title)}</h2><p>${esc(JOBS.body)}</p>${flow(JOBS.them)}${flow(JOBS.reddix)}</section>
    <section><h2>${esc(LADDER.title)}</h2><p>${esc(LADDER.body)}</p>
      <ul>${PLANS.map((p) => `<li><strong>${esc(p.name)}, $${p.price}/month:</strong> ${esc(p.unlocks.join('; '))}</li>`).join('')}</ul>
      <p>${esc(LADDER.marker)}: Pro.</p><p>${esc(LADDER.alerts)}</p><p>${esc(LADDER.credits)}</p></section>
    <section><h2>${esc(CALC.title)}</h2><p>${esc(CALC.body)}</p><p>${esc(CALC.keywordsHint)}</p>
      <p>Reddix: $${REDDIX_YEAR.premium} for 12 months of Premium, or $${REDDIX_YEAR.lifetime} once for Lifetime.</p><p>${esc(CALC.note)}</p></section>
    <section><h2>${esc(FITS.title)}</h2>
      <h3>${esc(FITS.them.title)}</h3><ul>${li(FITS.them.items)}</ul>
      <h3>${esc(FITS.reddix.title)}</h3><ul>${li(FITS.reddix.items)}</ul></section>
    <section><h2>Questions buyers ask about ${esc(NAME)} and Reddix</h2><dl>${FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('')}</dl></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${CLOSE.related.map((r) => `<li><a href="${r.to}">${esc(r.label)}</a></li>`).join('')}</ul></section>
    <section><h2>Sources</h2><p>${esc(CHECKED)}.</p><ol>${SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('')}</ol></section>
  `;
}
