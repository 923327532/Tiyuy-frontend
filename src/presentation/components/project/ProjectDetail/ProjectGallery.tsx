'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Building, Building2, Play, Video } from 'lucide-react';;
import { ProjectFull } from '@/core/domain/entities/Project';

interface ProjectGalleryProps {
  project: ProjectFull;
  galleryImagesOnly: string[];
  blueprints: string[];
  video: string | null;
}

export function ProjectGallery({ project, galleryImagesOnly, blueprints, video }: ProjectGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* ── GALERÍA ── */}
      <div className="relative grid grid-cols-1 sm:grid-cols-4 grid-rows-1 sm:grid-rows-2 gap-2 h-64 sm:h-[480px] rounded-2xl overflow-hidden mb-2">
        {/* ── IZQUIERDA: Video o imagen principal ── */}
        <div
          className="col-span-1 sm:col-span-3 row-span-1 sm:row-span-2 relative bg-gray-900 cursor-pointer"
          onClick={() => {
            if (video && videoRef.current) {
              if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
              } else {
                videoRef.current.play();
                setIsPlaying(true);
              }
            }
          }}
        >
          {video ? (
            <>
              <video
                ref={videoRef}
                src={video}
                loop
                playsInline
                className="w-full h-full object-cover"
                poster={galleryImagesOnly[0] || undefined}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 hover:bg-black/70 transition rounded-full p-5">
                    <Play className="w-12 h-12 text-white" fill="currentColor" />
                  </div>
                </div>
              )}

              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" fill="currentColor" />
                VIDEO 360°
              </span>
            </>
          ) : galleryImagesOnly.length > 0 ? (
            <Image
              src={galleryImagesOnly[currentImageIndex]}
              alt={`Imagen principal de ${project.name}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-teal-200 flex items-center justify-center">
              <Building className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Flechas de navegación en la imagen grande - visibles en todos los tamaños */}
          {galleryImagesOnly.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => prev > 0 ? prev - 1 : galleryImagesOnly.length - 1);
                }}
                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg text-lg transition hover:scale-105"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => prev < galleryImagesOnly.length - 1 ? prev + 1 : 0);
                }}
                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg text-lg transition hover:scale-105"
              >
                ›
              </button>
              <span className="absolute top-3 right-3 z-20 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                {currentImageIndex + 1}/{galleryImagesOnly.length}
              </span>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-white text-sm font-semibold">{project.name}</span>
          </div>
        </div>

        {/* ── DERECHA: 2 imágenes en columna ── */}
        {galleryImagesOnly.slice(1, 3).map((imageUrl, index) => (
          <div
            key={index + 1}
            className="hidden sm:block relative bg-gray-200 cursor-pointer group overflow-hidden"
            onClick={() => { setCurrentImageIndex(index + 1); setShowAllImages(true); }}
          >
            <Image
              src={imageUrl}
              alt={`${project.name} - imagen ${index + 2}`}
              fill
              className="object-cover group-hover:brightness-90 transition duration-300"
              sizes="25vw"
            />
          </div>
        ))}

        {galleryImagesOnly.length <= 1 && (
          <>
            <div className="hidden sm:block w-full h-full bg-gray-100" />
            <div className="hidden sm:block w-full h-full bg-gray-100" />
          </>
        )}

        <button
          onClick={() => setShowAllImages(true)}
          className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-gray-50 transition z-10"
        >
          🖼 Ver todas las fotos
          {galleryImagesOnly.length > 0 && (
            <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{galleryImagesOnly.length}</span>
          )}
          {blueprints.length > 0 && (
            <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">Planos: {blueprints.length}</span>
          )}
        </button>
      </div>

      {/* ── MODAL GALERÍA COMPLETA (solo desktop) ── */}
      {showAllImages && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowAllImages(false)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
          >
            ✕
          </button>

          <div className="w-full max-w-5xl px-2 sm:px-4">
            <div className="relative h-[60vh] mb-4">
              {galleryImagesOnly[currentImageIndex] && (
                <Image src={galleryImagesOnly[currentImageIndex]} alt="Galería" fill className="object-contain" />
              )}
              <button
                onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentImageIndex(Math.min(galleryImagesOnly.length - 1, currentImageIndex + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
              >
                ›
              </button>
              <span className="absolute bottom-2 right-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                {currentImageIndex + 1} / {galleryImagesOnly.length}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImagesOnly.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt={`thumb ${index}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}