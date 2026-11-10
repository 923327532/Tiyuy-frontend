'use client';
import Image from 'next/image';
import { type CSSProperties } from 'react';
import { useParallax } from '../hooks/use-scroll-reveal';

interface ParallaxImageProps {
  src: string;
  alt: string;
  preload?: boolean;
  sizes?: string;
  speed?: number;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  quality?: number;
}

export function ParallaxImage({
  src,
  alt,
  preload = false,
  sizes = '100vw',
  speed = 0.12,
  className = '',
  imageClassName = '',
  objectPosition = 'center',
  quality = 0,
}: ParallaxImageProps) {
  const ref = useParallax<HTMLDivElement>(speed);

  return (
    <div
      ref={ref}
      className={`about-parallax absolute inset-0 ${className}`}
      style={{ '--about-object-position': objectPosition } as CSSProperties}
    >
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        sizes={sizes}
        quality={quality}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}
