import { SOURCES } from '../content';

/** A numbered link to the source list at the foot of the page. */
export function Ref({ id, light = false }: { id: string; light?: boolean }) {
  const n = SOURCES.findIndex((s) => s.id === id) + 1;
  if (!n) return null;
  return (
    <sup className="ml-0.5 text-[0.65em] font-semibold">
      <a href={`#rc-src-${n}`} className={light ? 'rounded px-0.5 text-white/80 hover:underline' : 'rounded px-0.5 text-cta hover:underline'} aria-label={`Source ${n}`}>
        {n}
      </a>
    </sup>
  );
}
