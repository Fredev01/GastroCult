import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { MapUpdater, MapResizer } from './MapUtils';
import type { LatLngTuple, OSMRestaurant } from '../../types';
import { getRestaurantIcon } from '../../utils/helpers';
import RestaurantPopup from '../RestaurantPopup';

interface RestaurantMapProps {
    center: LatLngTuple;
    restaurants: OSMRestaurant[];
    initialLoad: boolean;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({ center, restaurants, initialLoad }) => {
    return (
        <div className="flex-1 relative min-h-[400px]">
            {initialLoad && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-3 text-gray-600">Cargando mapa...</p>
                    </div>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={13}
                className="h-full w-full"
                zoomControl={true}
                style={{ height: '75vh', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} />
                <MapResizer />

                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        position={[restaurant.lat, restaurant.lng]}
                        icon={getRestaurantIcon(restaurant.type)}
                    >
                        <Popup maxWidth={300} className="custom-popup">
                            <RestaurantPopup restaurant={restaurant} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default RestaurantMap;