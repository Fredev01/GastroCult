import React from 'react';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import type { OSMRestaurant } from '../types';
import { getPlaceIconComponent, translateAmenityType } from '../utils/helpers';

interface RestaurantPopupProps {
    restaurant: OSMRestaurant;
}

const RestaurantPopup: React.FC<RestaurantPopupProps> = ({ restaurant }) => {
    const IconComponent = getPlaceIconComponent(restaurant.type);

    return (
        <div className="p-3">
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900 pr-2">{restaurant.name}</h3>
                <div className="flex items-center">
                    <IconComponent className="w-4 h-4" />
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
    );
};

export default RestaurantPopup;