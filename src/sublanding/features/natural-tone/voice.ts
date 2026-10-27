/**
 * Builds what the voice section shows: the lines the prompt gets for a tone
 * and pricing model (as in generate-reply), and an example reply in that
 * voice, with the pricing hook folded into the product mention.
 */
import { VOICE } from './content';

export type Tone = (typeof VOICE.tones)[number];
export type Pricing = (typeof VOICE.pricing)[number];

/** The prompt's TONE block and pricing hook line, word for word. */
export function instructionLines(tone: Tone, pricing: Pricing): string[] {
  return ['=== TONE ===', tone.line, ...(pricing.hook ? [`Pricing hook: ${pricing.hook}`] : [])];
}

export function exampleReply(tone: Tone, pricing: Pricing): string {
  const hook = pricing.hook ? `, and ${pricing.hook.replace(/'/g, '’')}` : '';
  return `${tone.lead} ${tone.mention}${hook}.\n${VOICE.url}`;
}
