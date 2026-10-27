/**
 * /alternatives as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { ALSO_SECTION, CLOSE, DIRECTORY, FAQ, FINDER, GONE, HERO, LINE, METHOD } from './content';
import { ALSO, REDDIX_ROW, STOPS, TOOLS } from './directory';

export function crawlerBody(esc: (s: string) => string): string {
  const live = TOOLS.filter((t) => !t.gone);
  const stops = STOPS.map((s) => {
    const here = live.filter((t) => t.stop === s.id);
    const reddix = s.id === REDDIX_ROW.stop ? `<li><strong>Reddix</strong>: ${esc(REDDIX_ROW.what)} ${esc(REDDIX_ROW.price)}</li>` : '';
    const rows = here
      .map((t) => `<li><a href="/alternatives/${t.slug}"><strong>${esc(t.name)}</strong></a>: ${esc(t.what)} ${esc(t.price)}</li>`)
      .join('');
    return here.length || reddix ? `<h3>${esc(s.name)}</h3><p>${esc(s.line)}</p><ul>${reddix}${rows}</ul>` : '';
  }).join('');
  const rules = LINE.rules.items.map((r) => `<li>${esc(r.text)} <a href="${r.url}">${esc(r.source)}</a></li>`).join('');
  const gone = TOOLS.filter((t) => t.gone)
    .map((t) => `<li><a href="/alternatives/${t.slug}"><strong>${esc(t.name)} alternative</strong></a> (${esc(t.gone ?? '')}): ${esc(t.what)}</li>`)
    .join('');
  const also = ALSO.map((a) => `<li><a href="${a.url}" rel="nofollow">${esc(a.name)}</a>: ${esc(a.what)}</li>`).join('');
  const method = METHOD.items.map((m) => `<li>${esc(m)}</li>`).join('');
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  return `
    <p>${esc(HERO.checked)}</p>
    <section><h2>${esc(LINE.title)}</h2><p>${esc(LINE.body)}</p>
      <h3>${esc(LINE.rules.title)}</h3><ul>${rules}</ul><p>${esc(LINE.rules.note)}</p></section>
    <section><h2>${esc(FINDER.title)}</h2><p>${esc(FINDER.body)}</p></section>
    <section><h2>${esc(DIRECTORY.title)}</h2><p>${esc(DIRECTORY.body)}</p>${stops}</section>
    <section><h2>${esc(GONE.title)}</h2><p>${esc(GONE.body)}</p><ul>${gone}</ul></section>
    <section><h2>${esc(ALSO_SECTION.title)}</h2><p>${esc(ALSO_SECTION.body)}</p><ul>${also}</ul></section>
    <section><h2>${esc(METHOD.title)}</h2><ol>${method}</ol></section>
    <section><h2>Choosing a Reddit lead tool</h2><dl>${faq}</dl></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p></section>
  `;
}
