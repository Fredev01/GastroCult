import { useState, useEffect } from 'react';
import type { LatLngTuple, OSMRestaurant, SearchResult } from '../../types';
import { searchPlaces, searchRestaurants } from '../../services/osmApi';
import SearchBar from '../../components/SearchBar';
import SearchControls from '../../components/SearchControls';
import RestaurantMap from '../../components/Map/RestaurantMap';
import LoadingIndicator from '../../components/LoadingIndicator';


function MapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([16.7569, -93.1292]); // Tuxtla Gutiérrez
    const [restaurants, setRestaurants] = useState<OSMRestaurant[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const [currentLocation, setCurrentLocation] = useState('');
    const [searchRadius, setSearchRadius] = useState(2000);

    const handleSearch = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoadingSearch(true);
        try {
            const results = await searchPlaces(searchTerm);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching places:', error);
            setSearchResults([]);
        } finally {
            setIsLoadingSearch(false);
        }
    };

    const handlePlaceSelect = async (result: SearchResult) => {
        const newCenter: LatLngTuple = [parseFloat(result.lat), parseFloat(result.lon)];
        setMapCenter(newCenter);
        setSearchResults([]);
        setCurrentLocation(result.display_name);
        setSearchTerm(result.display_name);
        setInitialLoad(false);

        // Search for restaurants in the selected location
        await fetchRestaurants(parseFloat(result.lat), parseFloat(result.lon), searchRadius);
    };

    const fetchRestaurants = async (lat: number, lng: number, radius: number) => {
        setIsLoadingRestaurants(true);
        try {
            const restaurantData = await searchRestaurants(lat, lng, radius);
            setRestaurants(restaurantData);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setRestaurants([]);
        } finally {
            setIsLoadingRestaurants(false);
        }
    };

    const handleRadiusChange = (newRadius: number) => {
        setSearchRadius(newRadius);
        if (mapCenter[0] !== 16.7569 || mapCenter[1] !== -93.1292) {
            fetchRestaurants(mapCenter[0], mapCenter[1], newRadius);
        }
    };

    useEffect(() => {
        const initializeMap = async () => {
            await fetchRestaurants(16.7569, -93.1292, searchRadius);
            setCurrentLocation('Tuxtla Gutiérrez, Chiapas');

            const timer = setTimeout(() => {
                setInitialLoad(false);
            }, 1000);

            return () => clearTimeout(timer);
        };

        initializeMap();
    }, []);

    return (
        <div className="h-full flex flex-col min-h-[500px]">
            {/* Search Section */}
            <div className="bg-white p-6 shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSearch={handleSearch}
                        isLoading={isLoadingSearch}
                        searchResults={searchResults}
                        onPlaceSelect={handlePlaceSelect}
                    />

                    <SearchControls
                        currentLocation={currentLocation}
                        restaurantCount={restaurants.length}
                        searchRadius={searchRadius}
                        onRadiusChange={handleRadiusChange}
                    />
                </div>
            </div>

            {/* Map Section */}
            <RestaurantMap
                center={mapCenter}
                restaurants={restaurants}
                initialLoad={initialLoad}
            />

            {/* Loading Indicator */}
            <LoadingIndicator
                isLoading={isLoadingRestaurants}
                message="Buscando restaurantes..."
            />
        </div>
    );
}

export default MapPage;