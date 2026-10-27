/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { CLOSE, FAQ, FLOW, HANDOFF, INPUTS, NEVER, VARIANTS } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const flow = FLOW.map((f) => `<li><strong>${esc(f.label)}: ${esc(f.title)}.</strong> ${esc(f.body)}</li>`).join('');
  const rows = (list: { name: string; value: string }[]) =>
    list.map((r) => `<dt>${esc(r.name)}</dt><dd>${esc(r.value)}</dd>`).join('');
  const reads = INPUTS.reads.map((r) => `<li>${esc(r)}</li>`).join('');
  const drafts = VARIANTS.drafts
    .map((d) => `<li><strong>${esc(d.name)}</strong> — ${esc(d.angle)}<blockquote>${esc(d.text).replace(/\n/g, '<br>')}</blockquote></li>`)
    .join('');
  const steps = HANDOFF.steps.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)}</li>`).join('');
  const extras = HANDOFF.extras.map((x) => `<li><strong>${esc(x.title)}.</strong> ${esc(x.body)}</li>`).join('');
  const never = NEVER.items.map((n) => `<li>${esc(n)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const related = CLOSE.related.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join('');
  return `
    <section><ol>${flow}</ol></section>
    <section><h2>${esc(INPUTS.title)}</h2><p>${esc(INPUTS.body)}</p>
      <h3>${esc(INPUTS.post.title)}</h3><dl>${rows(INPUTS.post.rows)}</dl>
      <h3>${esc(INPUTS.profile.title)}</h3><dl>${rows(INPUTS.profile.rows)}</dl>
      <h3>${esc(INPUTS.readsTitle)}</h3><ul>${reads}</ul><p>${esc(INPUTS.profileNote)}</p></section>
    <section><h2>${esc(VARIANTS.title)}</h2><p>${esc(VARIANTS.body)}</p>
      <p><strong>${esc(VARIANTS.post.subreddit)}: ${esc(VARIANTS.post.title)}</strong> ${esc(VARIANTS.post.body)}</p>
      <ul>${drafts}</ul><p>${esc(VARIANTS.note)}</p></section>
    <section><h2>${esc(HANDOFF.title)}</h2><p>${esc(HANDOFF.body)}</p><ol>${steps}</ol><ul>${extras}</ul></section>
    <section><h2>${esc(NEVER.title)}</h2><ul>${never}</ul></section>
    <section><h2>Questions about AI replies</h2><dl>${faq}</dl></section>
    <section><h2>${esc(CLOSE.title)}</h2><p>${esc(CLOSE.body)}</p><ul>${related}</ul></section>
  `;
}
