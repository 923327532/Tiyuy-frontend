export interface NominatimAddress {
  city?: string;
  town?: string;
  municipality?: string;
  district?: string;
  county?: string;
  country?: string;
  [key: string]: string | undefined;
}

/** Extrae el distrito/ciudad priorizando los campos más específicos de Nominatim. */
export function extractDistrict(address: NominatimAddress): string {
  return (
    address.city ||
    address.town ||
    address.municipality ||
    address.district ||
    address.county ||
    ''
  );
}

/** Construye la dirección legible quitando el país del final del display_name. */
export function buildAddressText(displayName?: string, country?: string): string {
  if (!displayName) return '';

  const parts = displayName
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (country && parts.length > 1) {
    const last = parts[parts.length - 1].toLowerCase();
    if (last.includes(country.toLowerCase())) parts.pop();
  }

  return parts.join(', ');
}
