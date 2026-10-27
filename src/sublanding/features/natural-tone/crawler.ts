/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CLOSE, COMPARE, FAQ, ON_YOU, RULES, VOICE } from './content';
import { exampleReply } from './voice';

export function crawlerBody(esc: (s: string) => string): string {
  const reply = COMPARE.reply.parts.map((p) => p.text).join('');
  const rules = RULES.items
    .map((r) => `<li><h3>${esc(r.rule)}</h3><p>${esc(r.prompt)}</p><p>${esc(r.why)}</p></li>`)
    .join('');
  const pricing = VOICE.pricing.find((p) => p.value === VOICE.defaultPricing) ?? VOICE.pricing[0];
  const tones = VOICE.tones
    .map((t) => `<li><strong>${esc(t.name)}</strong> — ${esc(t.line)}<blockquote>${esc(exampleReply(t, pricing)).replace(/\n/g, '<br>')}</blockquote></li>`)
    .join('');
  const hooks = VOICE.pricing.map((p) => `<li>${esc(p.name)}: ${p.hook ? esc(p.hook) : 'no pricing line'}</li>`).join('');
  const onYou = ON_YOU.items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const related = CLOSE.related.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a></li>`).join('');
  return `
    <section><p>${esc(COMPARE.post)}</p>
      <h3>${esc(COMPARE.ad.label)}</h3><blockquote>${esc(COMPARE.ad.text)}</blockquote>
      <h3>${esc(COMPARE.reply.label)}</h3><blockquote>${esc(reply)}<br>${esc(COMPARE.reply.link)}</blockquote>
      <p>${esc(COMPARE.note)}</p></section>
    <section><h2>${esc(RULES.title)}</h2><p>${esc(RULES.body)}</p><ol>${rules}</ol></section>
    <section><h2>${esc(VOICE.title)}</h2><p>${esc(VOICE.body)}</p>
      <h3>${esc(VOICE.toneLabel)}</h3><ul>${tones}</ul>
      <h3>${esc(VOICE.pricingLabel)}</h3><ul>${hooks}</ul><p>${esc(VOICE.note)}</p></section>
    <section><h2>${esc(ON_YOU.title)}</h2><p>${esc(ON_YOU.body)}</p><ul>${onYou}</ul></section>
    <section><h2>Natural tone, answered</h2><dl>${faq}</dl></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${related}</ul></section>
  `;
}
