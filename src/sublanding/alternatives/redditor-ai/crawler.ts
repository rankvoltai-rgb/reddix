/**
 * The page as plain HTML for crawlers: same sections, order and words
 * (scripts/prerender.ts).
 */
import { ACTOR_LABEL, CLOSING, FAQ, FIT, GLANCE, HERO, INSTEAD, SOURCES, STRENGTHS, WALK, WORDS, type Actor } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const glance = GLANCE.rows.map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.them)}</td><td>${esc(r.us)}</td></tr>`).join('');
  const strengths = STRENGTHS.items.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)}</li>`).join('');
  const steps = WALK.steps
    .map(
      (s) =>
        `<li><strong>${esc(s.title)}.</strong> Redditor AI (${esc(ACTOR_LABEL[s.them.who as Actor])}): ${esc(s.them.text)} Reddix (${esc(
          ACTOR_LABEL[s.us.who as Actor],
        )}): ${esc(s.us.text)}</li>`,
    )
    .join('');
  const pairs = WORDS.pairs
    .map((p) => {
      const r = p.reddit as { quote?: string; where: string; note?: string };
      const reddit = [r.quote ? `“${esc(r.quote)}”` : '', r.note ? esc(r.note) : ''].filter(Boolean).join(' ');
      return `<li><strong>${esc(p.topic)}.</strong> Redditor AI: “${esc(p.them.quote)}” (${esc(p.them.where)}). Reddit: ${reddit} (${esc(r.where)}).</li>`;
    })
    .join('');
  const instead = INSTEAD.items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.body)}</li>`).join('');
  const fit = (side: { name: string; items: readonly string[] }) => `<h3>${esc(side.name)}</h3><ul>${side.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <p>${esc(HERO.checked)}</p>
    <section><h2>${esc(GLANCE.title)}</h2><table><thead><tr><th></th><th>Redditor AI</th><th>Reddix</th></tr></thead><tbody>${glance}</tbody></table></section>
    <section><h2>${esc(STRENGTHS.title)}</h2><p>${esc(STRENGTHS.body)}</p><ul>${strengths}</ul></section>
    <section><h2>${esc(WALK.title)}</h2><p>${esc(WALK.body)}</p><ol>${steps}</ol></section>
    <section><h2>${esc(WORDS.title)}</h2><p>${esc(WORDS.body)}</p><ul>${pairs}</ul></section>
    <section><h2>${esc(INSTEAD.title)}</h2><ol>${instead}</ol></section>
    <section><h2>${esc(FIT.title)}</h2>${fit(FIT.them)}${fit(FIT.us)}</section>
    <section><h2>Redditor AI and Reddix, answered</h2><dl>${faq}</dl></section>
    <section><h2>Where every fact comes from</h2><p>All pages opened on October 27, 2026.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p></section>
  `;
}
