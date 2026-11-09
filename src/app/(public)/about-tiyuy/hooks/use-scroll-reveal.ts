'use client';
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

export interface UseScrollRevealOptions {
  /** Porción del elemento visible para disparar (0 a 1). */
  threshold?: number;
  /** Margen del viewport. Negativo = dispara un poco más tarde. */
  rootMargin?: string;
  /** Si es false, el elemento se oculta de nuevo al salir del viewport. */
  once?: boolean;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Accesibilidad y compatibilidad: sin animación, contenido visible de inmediato.
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * Desplaza suavemente un elemento en función del scroll.
 * Usa exclusivamente transform y requestAnimationFrame. Se desactiva en
 * móvil y con prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      prefersReducedMotion() ||
      typeof window === 'undefined' ||
      window.matchMedia('(max-width: 767px)').matches
    ) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const raw =
        (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      // El CSS escala la imagen 1.1; limitamos a ±4% para no descubrir bordes.
      const max = rect.height * 0.04;
      const offset = Math.max(-max, Math.min(max, raw));
      node.style.setProperty('--about-parallax', `${offset.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      node.style.removeProperty('--about-parallax');
    };
  }, [speed]);

  return ref;
}

/** Progreso de lectura de la página (0 a 1). */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

/**
 * Escribe el progreso de un elemento respecto al viewport en una variable CSS.
 * Se usa para el rail de la línea de tiempo sin provocar re-renders.
 */
export function useElementProgressVar<T extends HTMLElement = HTMLDivElement>(
  variable = '--about-progress',
  damp = 0.15
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion() || typeof window === 'undefined') {
      node.style.setProperty(variable, '1');
      return () => node.style.removeProperty(variable);
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * (1 - damp);
      const end = -rect.height + viewport * damp;
      const span = Math.max(start - end, 1);
      const value = Math.min(1, Math.max(0, (start - rect.top) / span));
      node.style.setProperty(variable, value.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      node.style.removeProperty(variable);
    };
  }, [variable, damp]);

  return ref;
}

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealProps extends UseScrollRevealOptions {
  children: ReactNode;
  /** Elemento HTML a renderizar. Por defecto "div". */
  as?: ElementType;
  className?: string;
  /** Dirección de entrada. Por defecto "up". */
  direction?: Direction;
  /** Retraso en ms. Úsalo para escalonar tarjetas: index * 80. */
  delay?: number;
  /** Duración en ms. */
  duration?: number;
  /** Distancia del desplazamiento en px. Sutil = más premium. */
  distance?: number;
}

export function Reveal({
  children,
  as = 'div',
  className,
  direction = 'up',
  delay = 0,
  duration = 800,
  distance = 24,
  threshold,
  rootMargin,
  once,
}: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({
    threshold,
    rootMargin,
    once,
  });

  const style = {
    '--about-delay': `${delay}ms`,
    '--about-duration': `${duration}ms`,
    '--about-distance': `${distance}px`,
  } as CSSProperties & Record<string, string>;

  const classes = [
    'about-reveal',
    direction === 'none' ? 'about-reveal--none' : `about-reveal--${direction}`,
    isVisible ? 'is-visible' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return createElement(as, { ref, className: classes, style }, children);
}
