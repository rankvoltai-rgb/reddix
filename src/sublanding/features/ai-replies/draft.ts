/**
 * Reads a reply the way Reddix's drafts are written (generate-reply, rules 4
 * and 6): 120–250 characters, with the product link on its own last line and
 * left out of the count.
 */

export const MIN_CHARS = 120;
export const MAX_CHARS = 250;

export type Band = 'empty' | 'short' | 'fits' | 'long';
export type LinkState = 'last-line' | 'inline' | 'none';

export interface DraftReading {
  /** Characters in the reply, not counting a link on its own last line. */
  chars: number;
  band: Band;
  link: LinkState;
}

/** One token, with a dot and no spaces: example.com, https://example.com/x. */
const LINK_LINE = /^(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)+(?:\/\S*)?$/i;
const LINK_ANYWHERE = /(?:https?:\/\/|www\.)\S+|\b[\w-]+\.(?:com|io|app|co|ai|dev|so|net|org|example)\b/i;

export function readDraft(text: string): DraftReading {
  const lines = text.replace(/\s+$/, '').split('\n');
  const last = lines[lines.length - 1]?.trim() ?? '';
  const ownLine = lines.length > 1 && LINK_LINE.test(last);
  const body = (ownLine ? lines.slice(0, -1).join('\n') : lines.join('\n')).trim();
  const chars = body.length;
  const band: Band = chars === 0 ? 'empty' : chars < MIN_CHARS ? 'short' : chars <= MAX_CHARS ? 'fits' : 'long';
  const link: LinkState = ownLine ? 'last-line' : LINK_ANYWHERE.test(body) ? 'inline' : 'none';
  return { chars, band, link };
}
