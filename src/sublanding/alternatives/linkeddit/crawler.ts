/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CHECKED_LABEL } from '../reddix';
import { ARCHIVE, CLOSE, FAQ, FEATURES, FORMER, LIFETIME, LINEUP, NOW, RESPONSES, SNAPSHOTS, SOURCES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const responses = RESPONSES.map((r) => `<li><code>${esc(r.path)}</code>: ${r.code} ${esc(r.text)}</li>`).join('');
  const snaps = SNAPSHOTS.map(
    (s) =>
      `<tr><td>${esc(s.date)}${s.kind === 'live' ? ' (live)' : ''}</td><td>${esc(s.title)}</td><td>${esc(s.price)}</td><td>${FEATURES.filter((f) => s.marks[f] === 'listed')
        .map(esc)
        .join(', ') || (Object.values(s.marks).every((m) => m === 'absent') ? 'None' : '—')}</td></tr>`,
  ).join('');
  const former = FORMER.items.map((f) => `<li><strong>${esc(f.title)}.</strong> ${esc(f.body)}</li>`).join('');
  const now = NOW.items.map((x) => `<li>${esc(x)}</li>`).join('');
  const lineup = LINEUP.rows.map((r) => `<tr><td>${esc(r.old)}</td><td>${esc(LINEUP.legend[r.fit])}</td><td>${esc(r.reddix)}</td></tr>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}">${esc(s.label)}</a></li>`).join('');
  return `
    <section><p>What Linkeddit’s pages returned, checked ${esc(CHECKED_LABEL)}:</p><ul>${responses}</ul></section>
    <section><h2>${esc(ARCHIVE.title)}</h2><p>${esc(ARCHIVE.body)}</p>
      <table><thead><tr><th>Copy</th><th>Title</th><th>Price shown</th><th>Reddit features listed</th></tr></thead><tbody>${snaps}</tbody></table>
      <p>The change falls between September 15 and October 27, 2026. Linkeddit hasn’t announced it.</p></section>
    <section><h2>${esc(FORMER.title)}</h2><p>${esc(FORMER.body)}</p><ul>${former}</ul></section>
    <section><h2>${esc(NOW.title)}</h2><p>${esc(NOW.body)}</p><p>${esc(NOW.plan.name)}: ${esc(NOW.plan.price)}. ${esc(NOW.plan.billing)}.</p><ul>${now}</ul><p>${esc(NOW.note)}</p></section>
    <section><h2>${esc(LINEUP.title)}</h2><p>${esc(LINEUP.body)}</p>
      <table><thead><tr><th>Linkeddit (former)</th><th>Fit</th><th>Reddix</th></tr></thead><tbody>${lineup}</tbody></table></section>
    <section><h2>${esc(LIFETIME.title)}</h2><p>${esc(LIFETIME.body)}</p></section>
    <section><h2>Linkeddit and Reddit, answered</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><p><a href="/auth">${esc(CLOSE.button)}</a></p></section>
  `;
}
