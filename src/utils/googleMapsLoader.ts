// Cargador único de Google Maps JavaScript API (API oficial).
// Devuelve siempre la misma promesa, aunque varios componentes pidan el mapa a la vez.

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

let googleMapsPromise: Promise<any> | null = null;

export function loadGoogleMaps(): Promise<any> {
  const w = window as any;
  if (w.google?.maps) return Promise.resolve(w.google);
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (!GOOGLE_KEY) {
      googleMapsPromise = null;
      reject(new Error('Falta NEXT_PUBLIC_GOOGLE_PLACES_API_KEY'));
      return;
    }

    w.__tiyuyGoogleMapsReady = () => resolve(w.google);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&callback=__tiyuyGoogleMapsReady&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error('No se pudo cargar Google Maps'));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
