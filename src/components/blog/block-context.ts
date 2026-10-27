import { createContext } from 'react';

/** Heading anchors, filled by ArticleBody from the article outline, so the
 *  table of contents and the headings always agree on ids. */
export const BlockContext = createContext<{ anchors: Map<string, string> }>({ anchors: new Map() });
