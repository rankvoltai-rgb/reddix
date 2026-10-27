/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { AHEAD, CALCULATOR, CHECKED, CLOSING, DIFF, FAQ, PRICE_NOTE, SAME, SOURCES, TIERS, VENN } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const list = (items: readonly string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  const venn = [VENN.left, VENN.both, VENN.right].map((s) => `<h3>${esc(s.name)}</h3>${list(s.items)}`).join('');
  const diff = DIFF.groups
    .map((g) => `<tr><th scope="row">${esc(g.title)}</th><td>${esc(g.replydaddy)}</td><td>${esc(g.reddix)}</td></tr>`)
    .join('');
  const ahead = AHEAD.items.map((a) => `<li><strong>${esc(a.title)}.</strong> ${esc(a.body)}</li>`).join('');
  const tiers = TIERS.map(
    (t) => `<tr><td>${esc(t.name)}</td><td>$${t.monthly}/month or $${t.yearly}/year</td><td>${t.projects} project(s); per project ${t.subreddits} subreddits, ${t.keywords} keywords, ${t.scans} scans a month, ${t.posts} generated posts a month</td></tr>`,
  ).join('');
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <section><p>ReplyDaddy facts checked ${esc(CHECKED)}.</p>${venn}</section>
    <section><h2>${esc(SAME.title)}</h2>${SAME.body.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
    <section><h2>${esc(DIFF.title)}</h2><table><thead><tr><th></th><th>ReplyDaddy</th><th>Reddix</th></tr></thead><tbody>${diff}</tbody></table></section>
    <section><h2>${esc(AHEAD.title)}</h2><ul>${ahead}</ul></section>
    <section><h2>${esc(CALCULATOR.title)}</h2><p>${esc(CALCULATOR.body)}</p><table><tbody>${tiers}</tbody></table>
      <p>${esc(CALCULATOR.freeNote)} ${esc(CALCULATOR.customNote)}</p>
      <h3>${esc(PRICE_NOTE.title)}</h3><p>${esc(PRICE_NOTE.body)}</p></section>
    <section><h2>Questions people ask before switching</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Checked ${esc(CHECKED)}.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p><p><a href="/auth">${esc(CLOSING.button)}</a></p></section>
  `;
}
