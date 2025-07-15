import type { LocationInfo } from "../types";

export async function getUserLocation(): Promise<LocationInfo> {
    // 1. Pedir permiso y coordenadas
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation no soportada'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    });

    const { latitude, longitude } = position.coords;

    // 2. Llamada a Nominatim para obtener el nombre del lugar
    //    (puedes usar otro servicio con API key si lo prefieres)
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', latitude.toString());
    url.searchParams.set('lon', longitude.toString());

    const resp = await fetch(url.toString());
    if (!resp.ok) {
        throw new Error(`Reverse geocoding falló: ${resp.status}`);
    }
    const data = await resp.json();
    const placeName = data.display_name as string;

    // solo devolver el municipio, estado y pais
    const parts = placeName.split(', ');
    if (parts.length < 2) {
        throw new Error('No se pudo obtener el nombre del lugar');
    }
    const municipality = parts[parts.length - 4] || '';
    const state = parts[parts.length - 3] || '';
    const postalCode = parts[parts.length - 2] || '';
    const country = parts[parts.length - 1] || '';
    const formattedPlaceName = `${municipality}, ${state}, ${postalCode}, ${country}`.trim();

    return { latitude, longitude, placeName: formattedPlaceName };
}