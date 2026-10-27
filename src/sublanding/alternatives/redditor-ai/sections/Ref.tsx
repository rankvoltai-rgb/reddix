import { SOURCES, type SourceId } from '../content';

/** A numbered link to the source list at the foot of the page. */
export function Ref({ id }: { id: SourceId | string }) {
  const n = SOURCES.findIndex((s) => s.id === id) + 1;
  if (!n) return null;
  return (
    <sup className="ml-0.5 text-[0.65em] font-semibold">
      <a href={`#ra-src-${n}`} className="rounded px-0.5 text-cta hover:underline" aria-label={`Source ${n}`}>
        {n}
      </a>
    </sup>
  );
}
