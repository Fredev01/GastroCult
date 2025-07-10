import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search, MapPin, Utensils, Coffee, Star } from 'lucide-react';
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

interface GastronomicPlace {
    id: string;
    name: string;
    type: 'restaurant' | 'fonda' | 'mercado' | 'panaderia' | 'cafeteria';
    lat: number;
    lng: number;
    address: string;
    rating: number;
    description: string;
    specialties: string[];
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

function MapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([16.7569, -93.1292]); // Tuxtla Gutiérrez
    const [gastronomicPlaces, setGastronomicPlaces] = useState<GastronomicPlace[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // Mock data - En producción esto vendría de tu API
    const mockGastronomicPlaces: GastronomicPlace[] = [
        {
            id: '1',
            name: 'Restaurante La Pochota',
            type: 'restaurant',
            lat: 16.7569,
            lng: -93.1292,
            address: 'Centro Histórico, Tuxtla Gutiérrez',
            rating: 4.5,
            description: 'Comida tradicional chiapaneca con ingredientes locales',
            specialties: ['Cochito horneado', 'Tamales chiapanecos', 'Pozol']
        },
        {
            id: '2',
            name: 'Fonda Doña María',
            type: 'fonda',
            lat: 16.7580,
            lng: -93.1280,
            address: 'Mercado Juan Sabines, Tuxtla Gutiérrez',
            rating: 4.2,
            description: 'Auténtica cocina casera chiapaneca',
            specialties: ['Sopa de pan', 'Butifarra', 'Tamal de dulce']
        },
        {
            id: '3',
            name: 'Mercado de San Juan',
            type: 'mercado',
            lat: 16.7590,
            lng: -93.1270,
            address: 'Av. Central Norte, Tuxtla Gutiérrez',
            rating: 4.0,
            description: 'Mercado tradicional con gran variedad gastronómica',
            specialties: ['Queso de bola', 'Chorizo chiapaneco', 'Dulces típicos']
        }
    ];

    // Search for places using Nominatim API
    const searchPlaces = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
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
            setIsLoading(false);
        }
    };

    // Handle search input
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchPlaces(searchTerm);
    };

    // Handle place selection
    const handlePlaceSelect = (result: SearchResult) => {
        const newCenter: LatLngTuple = [parseFloat(result.lat), parseFloat(result.lon)];
        setMapCenter(newCenter);
        setSearchResults([]);
        setSearchTerm(result.display_name);

        // Simular búsqueda de lugares gastronómicos cerca del lugar seleccionado
        // En producción, aquí harías una llamada a tu API para buscar lugares gastronómicos
        setGastronomicPlaces(mockGastronomicPlaces);
    };

    // Get icon for place type
    const getPlaceIcon = (type: string) => {
        switch (type) {
            case 'restaurant':
                return <Utensils className="w-4 h-4" />;
            case 'fonda':
                return <Coffee className="w-4 h-4" />;
            case 'mercado':
                return <MapPin className="w-4 h-4" />;
            default:
                return <Utensils className="w-4 h-4" />;
        }
    };

    // Get star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    useEffect(() => {
        // Cargar lugares gastronómicos iniciales
        setGastronomicPlaces(mockGastronomicPlaces);
    }, []);

    return (
        <div className="h-full flex flex-col">
            {/* Search Section */}
            <div className="bg-white p-6 shadow-sm border-b border-gray-200">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar ciudad, lugar o dirección..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.place_id}
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
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Encuentra restaurantes, fondas, mercados y lugares gastronómicos tradicionales
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="flex-1 relative">
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    className="h-full w-full"
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapUpdater center={mapCenter} />

                    {/* Render gastronomic places */}
                    {gastronomicPlaces.map((place) => (
                        <Marker
                            key={place.id}
                            position={[place.lat, place.lng]}
                            icon={RestaurantIcon}
                        >
                            <Popup maxWidth={300} className="custom-popup">
                                <div className="p-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900">{place.name}</h3>
                                        <div className="flex items-center">
                                            {getPlaceIcon(place.type)}
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <div className="flex mr-2">
                                            {renderStars(place.rating)}
                                        </div>
                                        <span className="text-sm text-gray-600">({place.rating})</span>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                                    <p className="text-sm text-gray-800 mb-3">{place.description}</p>

                                    <div className="mb-3">
                                        <h4 className="font-medium text-sm text-gray-900 mb-1">Especialidades:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {place.specialties.map((specialty, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                                        Ver más detalles
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            <span className="text-sm text-gray-600">Buscando...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MapPage;