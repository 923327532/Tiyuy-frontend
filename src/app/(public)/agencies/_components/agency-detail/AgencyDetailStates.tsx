'use client';

import Link from 'next/link';
import { ArrowLeft, RotateCw } from 'lucide-react';

const BAR = 'rounded-lg bg-stone-200 motion-safe:animate-pulse';

export function AgencyDetailLoadingState() {
  return (
    <div className="min-h-screen bg-[#F4F0EA]" role="status" aria-live="polite" aria-label="Cargando agencia">
      <div className="border-b border-stone-200/70 bg-[#F3EFEA]">
        <div className="mx-auto max-w-[1440px] px-5 pb-14 pt-8 sm:px-8 lg:px-12">
          <div className={`${BAR} h-4 w-36`} />
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className={`${BAR} h-24 w-24 rounded-2xl sm:h-28 sm:w-28`} />
            <div className="w-full max-w-xl space-y-4">
              <div className={`${BAR} h-12 w-4/5`} />
              <div className={`${BAR} h-4 w-1/2`} />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:px-12">
        <div className="space-y-3">
          <div className={`${BAR} h-6 w-48`} />
          <div className={`${BAR} h-4 w-full max-w-2xl`} />
          <div className={`${BAR} h-4 w-full max-w-xl`} />
          <div className={`${BAR} h-4 w-2/3 max-w-lg`} />
        </div>
        <div className={`${BAR} h-96 rounded-2xl`} />
      </div>
      <span className="sr-only">Cargando agencia...</span>
    </div>
  );
}

export function AgencyDetailErrorState({ isError, onRetry }: { isError: boolean; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F0EA] px-5">
      <div className="max-w-md text-center" role="alert">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-3xl">
          {isError ? 'No pudimos cargar la agencia' : 'No encontramos esta agencia'}
        </h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          {isError
            ? 'Revisa tu conexión e inténtalo de nuevo.'
            : 'Puede que el enlace esté mal escrito o que la agencia ya no esté publicada.'}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isError && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#4A9A3E] px-6 text-sm font-bold text-white transition-all hover:bg-[#3b7c31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E] focus-visible:ring-offset-2"
            >
              <RotateCw aria-hidden="true" className="h-4 w-4" />
              Reintentar
            </button>
          )}
          <Link
            href="/agencies"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9A3E]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Ver todas las agencias
          </Link>
        </div>
      </div>
    </div>
  );
}
