import type { OSMRestaurant, SearchResult } from "../types";

export const searchPlaces = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
        return [];
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mx`
        );
        const results = await response.json();
        return results;
    } catch (error) {
        console.error('Error searching places:', error);
        return [];
    }
};

export const searchRestaurants = async (lat: number, lng: number, radius: number = 2000): Promise<OSMRestaurant[]> => {
    try {
        const overpassQuery = `
            [out:json][timeout:25];
            (
              node["amenity"~"^(restaurant|cafe|fast_food|pub|bar)$"](around:${radius},${lat},${lng});
              way["amenity"~"^(restaurant|cafe|fast_food|pub|bar)$"](around:${radius},${lat},${lng});
            );
            out center meta;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(overpassQuery)}`
        });

        const data = await response.json();

        const restaurantData: OSMRestaurant[] = data.elements.map((element: any) => {
            const lat = element.lat || element.center?.lat;
            const lng = element.lon || element.center?.lon;

            return {
                id: element.id.toString(),
                name: element.tags?.name || 'Sin nombre',
                type: element.tags?.amenity || 'restaurant',
                lat: lat,
                lng: lng,
                address: element.tags?.['addr:full'] ||
                    `${element.tags?.['addr:street'] || ''} ${element.tags?.['addr:housenumber'] || ''}`.trim() ||
                    undefined,
                cuisine: element.tags?.cuisine,
                phone: element.tags?.phone,
                website: element.tags?.website,
                opening_hours: element.tags?.opening_hours,
                tags: element.tags || {}
            };
        }).filter((restaurant: OSMRestaurant) => restaurant.lat && restaurant.lng);

        return restaurantData;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};