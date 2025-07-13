export interface OSMRestaurant {
    id: string;
    name: string;
    type: 'restaurant' | 'cafe' | 'fast_food' | 'pub' | 'bar';
    lat: number;
    lng: number;
    address?: string;
    cuisine?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    tags: Record<string, string>;
}

export interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
    place_id: string;
}

export interface Recipes {
    id?: string;
    name: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    imageUrl?: string;
}
interface Ingredient {
    name: string;
    quantity: string;
}

export type LatLngTuple = [number, number];