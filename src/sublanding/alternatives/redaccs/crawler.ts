/**
 * The page as plain HTML for crawlers: same sections, order and words
 * (scripts/prerender.ts).
 */
import { BUSINESSES, CATALOGUE, CLOSING, FAQ, FIT, HERO, OWN_WORDS, PRICES, RECEIPT, SIDE, SOURCES, UPVOTE_PACKS } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const catalogue = CATALOGUE.lines.map((l) => `<tr><td>${esc(l.item)}</td><td>${esc(l.detail)}</td><td>${esc(l.price)}</td></tr>`).join('');
  const list = (items: readonly { title: string; text: string }[]) => items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.text)}</li>`).join('');
  const vendor = OWN_WORDS.vendor.map((v) => `<li>“${esc(v.quote)}” (${esc(v.where)})</li>`).join('');
  const reddit = OWN_WORDS.reddit
    .map((r) => {
      const item = r as { quote?: string; note?: string; where: string };
      return `<li>${item.quote ? `“${esc(item.quote)}”` : esc(item.note ?? '')} (${esc(item.where)})</li>`;
    })
    .join('');
  const packs = UPVOTE_PACKS.map((p) => `$${p.price.toLocaleString('en-US')} for ${p.votes.toLocaleString('en-US')} votes`).join('; ');
  const side = SIDE.rows.map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.them)}</td><td>${esc(r.us)}</td></tr>`).join('');
  const fit = (s: { name: string; items: readonly string[] }) => `<section><h2>${esc(s.name)}</h2><ol>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ol></section>`;
  const faq = FAQ.map((f) => `<dt><strong>${esc(f.q)}</strong></dt><dd>${esc(f.a)}</dd>`).join('');
  const sources = SOURCES.map((s) => `<li><a href="${s.url}" rel="nofollow">${esc(s.label)}</a></li>`).join('');
  return `
    <section><h2>${esc(CATALOGUE.title)}</h2><p>${esc(HERO.checked)}</p><table><tbody>${catalogue}</tbody></table></section>
    <section><h2>${esc(BUSINESSES.title)}</h2><p>${esc(BUSINESSES.body)}</p>
      <h3>${esc(BUSINESSES.market.name)}</h3><ul>${list(BUSINESSES.market.items)}</ul>
      <h3>${esc(BUSINESSES.finder.name)}</h3><ul>${list(BUSINESSES.finder.items)}</ul></section>
    <section><h2>${esc(OWN_WORDS.title)}</h2><p>${esc(OWN_WORDS.body)}</p><h3>REDAccs</h3><ul>${vendor}</ul><h3>Reddit</h3><ul>${reddit}</ul></section>
    <section><h2>${esc(RECEIPT.title)}</h2><p>${esc(RECEIPT.body)}</p>
      <p>Custom comment $${PRICES.comment}; comment with a link $${PRICES.linkComment}; post $${PRICES.post}; upvote packs: ${esc(packs)}. ${esc(RECEIPT.packNote)}</p>
      <ul>${RECEIPT.fine.map((f) => `<li>“${esc(f.text)}”</li>`).join('')}</ul></section>
    <section><h2>${esc(SIDE.title)}</h2><p>${esc(SIDE.body)}</p><table><thead><tr><th></th><th>Thread Finder</th><th>Reddix</th></tr></thead><tbody>${side}</tbody></table></section>
    ${fit(FIT.them)}${fit(FIT.us)}
    <section><h2>REDAccs and Reddix: questions</h2><dl>${faq}</dl></section>
    <section><h2>Sources</h2><p>Opened on October 27, 2026.</p><ol>${sources}</ol></section>
    <section><h2>${esc(CLOSING.title)}</h2><p>${esc(CLOSING.body)}</p></section>
  `;
}
