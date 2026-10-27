/**
 * The page as plain HTML, for crawlers that don't run JavaScript. Same
 * sections, same order, same words as the page (scripts/prerender.ts).
 */
import { FAQ, LIMITS, MAP, NEXT, READ, SPECIMEN, USES } from './content';

export function crawlerBody(esc: (s: string) => string): string {
  const specimen = SPECIMEN.fields
    .map((f) => `<li><strong>${esc(f.label)}:</strong> ${esc(typeof f.value === 'string' ? f.value : f.value.join(', '))}</li>`)
    .join('');
  const steps = READ.steps
    .map((s) => `<li><strong>${esc(s.title)}</strong> (${esc(s.fact)}). ${esc(s.body)}</li>`)
    .join('');
  const fields = MAP.fields
    .map((f) => {
      const uses = USES.filter((u) => f.uses[u.id])
        .map((u) => `<li>${esc(u.label)}: ${esc(f.uses[u.id] ?? '')}</li>`)
        .join('');
      return `<li><h3>${esc(f.name)}</h3><p>${esc(f.source)} · ${esc(f.shape)} · ${f.editable ? 'Editable in Settings' : 'Set by the analysis'}</p>${
        uses ? `<ul>${uses}</ul>` : ''
      }<p>If it’s empty: ${esc(f.ifEmpty)}</p></li>`;
    })
    .join('');
  const limits = LIMITS.items.map((l) => `<li><strong>${esc(l.title)}.</strong> ${esc(l.body)}</li>`).join('');
  const faq = FAQ.map((q) => `<dt><strong>${esc(q.q)}</strong></dt><dd>${esc(q.a)}</dd>`).join('');
  const next = NEXT.links.map((l) => `<li><a href="${l.to}">${esc(l.title)}</a> — ${esc(l.body)}</li>`).join('');
  return `
    <section><p>${esc(SPECIMEN.note)}</p><ul>${specimen}</ul></section>
    <section><h2>${esc(READ.title)}</h2><p>${esc(READ.body)}</p><ol>${steps}</ol></section>
    <section><h2>${esc(MAP.title)}</h2><p>${esc(MAP.body)}</p><ul>${fields}</ul></section>
    <section><h2>${esc(LIMITS.title)}</h2><ul>${limits}</ul></section>
    <section><h2>Questions about the analysis</h2><dl>${faq}</dl></section>
    <section><h2>${esc(NEXT.cta.title)}</h2><p>${esc(NEXT.cta.body)}</p><ul>${next}</ul></section>
  `;
}
