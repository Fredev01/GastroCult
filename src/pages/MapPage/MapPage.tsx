import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, MapPin, Utensils, Coffee, Star, Clock, Phone, ExternalLink, Loader2 } from 'lucide-react';
import type { LatLngTuple } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for restaurants
const RestaurantIcon = L.divIcon({
    html: `<div class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8 2v6h4V2h1v7a1 1 0 01-1 1H8a1 1 0 01-1-1V2h1zm0 10v6h4v-6H8z"/>
    </svg>
  </div>`,
    className: 'custom-restaurant-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const CafeIcon = L.divIcon({
    html: `<div class="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v6h8V7H6z"/>
    </svg>
  </div>`,
    className: 'custom-cafe-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const FastFoodIcon = L.divIcon({
    html: `<div class="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
    </svg>
  </div>`,
    className: 'custom-fastfood-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

interface OSMRestaurant {
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

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
    place_id: string;
}

// Component to handle map view updates
function MapUpdater({ center }: { center: LatLngTuple }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);

    return null;
}

// Component to handle map resizing
function MapResizer() {
    const map = useMap();
    const resizeObserver = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        // Invalidate size after a short delay to ensure container has dimensions
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        // Setup ResizeObserver to handle container size changes
        const container = map.getContainer();
        resizeObserver.current = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.current.observe(container);

        return () => {
            clearTimeout(timer);
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
        };
    }, [map]);

    return null;
}

function MapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([16.7569, -93.1292]); // Tuxtla Gutiérrez
    const [restaurants, setRestaurants] = useState<OSMRestaurant[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [currentLocation, setCurrentLocation] = useState('');
    const [searchRadius, setSearchRadius] = useState(2000); // 2km radius

    // Search for places using Nominatim API
    const searchPlaces = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoadingSearch(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mx`
            );
            const results = await response.json();
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching places:', error);
            setSearchResults([]);
        } finally {
            setIsLoadingSearch(false);
        }
    };

    // Search for restaurants using Overpass API
    const searchRestaurants = async (lat: number, lng: number, radius: number = 2000) => {
        setIsLoadingRestaurants(true);
        try {
            const overpassQuery = `
                [out:json][timeout:25];
                (
                  node["amenity"~"^(restaurant)$"](around:${radius},${lat},${lng});
                  way["amenity"~"^(restaurant)$"](around:${radius},${lat},${lng});
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

            setRestaurants(restaurantData);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setRestaurants([]);
        } finally {
            setIsLoadingRestaurants(false);
        }
    };

    // Handle search input
    const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        searchPlaces(searchTerm);
    };

    // Handle place selection
    const handlePlaceSelect = (result: SearchResult) => {
        const newCenter: LatLngTuple = [parseFloat(result.lat), parseFloat(result.lon)];
        setMapCenter(newCenter);
        setSearchResults([]);
        setCurrentLocation(result.display_name);
        setSearchTerm(result.display_name);
        setInitialLoad(false);

        // Search for restaurants in the selected location
        searchRestaurants(parseFloat(result.lat), parseFloat(result.lon), searchRadius);
    };

    // Get icon for restaurant type
    const getRestaurantIcon = (type: string) => {
        switch (type) {
            case 'restaurant':
                return RestaurantIcon;
            case 'cafe':
                return CafeIcon;
            case 'fast_food':
                return FastFoodIcon;
            case 'pub':
            case 'bar':
                return CafeIcon;
            default:
                return RestaurantIcon;
        }
    };

    // Get icon component for display
    const getPlaceIcon = (type: string) => {
        switch (type) {
            case 'restaurant':
                return <Utensils className="w-4 h-4" />;
            case 'cafe':
                return <Coffee className="w-4 h-4" />;
            case 'fast_food':
                return <Coffee className="w-4 h-4" />;
            default:
                return <Utensils className="w-4 h-4" />;
        }
    };

    // Translate amenity types to Spanish
    const translateAmenityType = (type: string) => {
        const translations: Record<string, string> = {
            restaurant: 'Restaurante',
            cafe: 'Café',
            fast_food: 'Comida rápida',
            pub: 'Pub',
            bar: 'Bar'
        };
        return translations[type] || type;
    };

    // Handle radius change
    const handleRadiusChange = (newRadius: number) => {
        setSearchRadius(newRadius);
        if (mapCenter[0] !== 16.7569 || mapCenter[1] !== -93.1292) {
            searchRestaurants(mapCenter[0], mapCenter[1], newRadius);
        }
    };

    useEffect(() => {
        // Load initial restaurants for default location
        searchRestaurants(16.7569, -93.1292, searchRadius);
        setCurrentLocation('Tuxtla Gutiérrez, Chiapas');

        // Simulate initial loading
        const timer = setTimeout(() => {
            setInitialLoad(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-full flex flex-col min-h-[500px]">
            {/* Search Section */}
            <div className="bg-white p-6 shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                placeholder="Buscar ciudad, lugar o dirección..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {isLoadingSearch && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.place_id}
                                        type="button"
                                        onClick={() => handlePlaceSelect(result)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                            <span className="text-sm text-gray-900 truncate">{result.display_name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <div className="text-sm text-gray-600">
                                {currentLocation && (
                                    <span className="font-medium">📍 {currentLocation}</span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                {restaurants.length} lugares encontrados
                            </div>
                        </div>

                        {/* Radius Control */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 font-medium">Radio de búsqueda:</label>
                            <select
                                value={searchRadius}
                                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value={500}>500m</option>
                                <option value={1000}>1km</option>
                                <option value={2000}>2km</option>
                                <option value={5000}>5km</option>
                                <option value={10000}>10km</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="flex-1 relative min-h-[400px]">
                {initialLoad ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="mt-3 text-gray-600">Cargando mapa...</p>
                        </div>
                    </div>
                ) : null}

                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    className="h-full w-full"
                    zoomControl={true}
                    style={{ height: '75vh', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapUpdater center={mapCenter} />
                    <MapResizer />

                    {/* Render restaurants */}
                    {restaurants.map((restaurant) => (
                        <Marker
                            key={restaurant.id}
                            position={[restaurant.lat, restaurant.lng]}
                            icon={getRestaurantIcon(restaurant.type)}
                        >
                            <Popup maxWidth={300} className="custom-popup">
                                <div className="p-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900 pr-2">{restaurant.name}</h3>
                                        <div className="flex items-center">
                                            {getPlaceIcon(restaurant.type)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {translateAmenityType(restaurant.type)}
                                        </span>
                                        {restaurant.cuisine && (
                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full ml-1">
                                                {restaurant.cuisine}
                                            </span>
                                        )}
                                    </div>

                                    {restaurant.address && (
                                        <div className="flex items-start mb-2">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-gray-600">{restaurant.address}</p>
                                        </div>
                                    )}

                                    {restaurant.phone && (
                                        <div className="flex items-center mb-2">
                                            <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                            <p className="text-sm text-gray-600">{restaurant.phone}</p>
                                        </div>
                                    )}

                                    {restaurant.opening_hours && (
                                        <div className="flex items-start mb-2">
                                            <Clock className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-gray-600">{restaurant.opening_hours}</p>
                                        </div>
                                    )}

                                    {restaurant.website && (
                                        <div className="mt-3">
                                            <a
                                                href={restaurant.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Ver sitio web
                                            </a>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                                            Cómo llegar
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Loading indicator for restaurants */}
                {isLoadingRestaurants && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            <span className="text-sm text-gray-600">Buscando restaurantes...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MapPage;