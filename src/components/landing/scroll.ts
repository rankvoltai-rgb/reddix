import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/* The fixed navbar's height, kept clear when scrolling to a section. */
const HEADER_HEIGHT = 64;

/** Scrolls to a landing-page section, clear of the fixed bar. Sections below
 *  the hero are lazy-loaded, so after navigating home this waits for one to
 *  mount. */
export function scrollToSection(id: string, tries = 20) {
  const el = document.getElementById(id);
  if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT, behavior: 'smooth' });
  } else if (tries > 0) {
    window.setTimeout(() => scrollToSection(id, tries - 1), 100);
  }
}

/** Goes to a landing-page section from any page. */
export function useGoToSection() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return useCallback(
    (id: string) => {
      if (pathname !== '/') navigate('/');
      scrollToSection(id);
    },
    [navigate, pathname],
  );
}
