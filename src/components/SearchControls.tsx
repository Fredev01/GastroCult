import React from 'react';

interface SearchControlsProps {
    currentLocation: string;
    restaurantCount: number;
    searchRadius: number;
    onRadiusChange: (radius: number) => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
    currentLocation,
    restaurantCount,
    searchRadius,
    onRadiusChange
}) => {
    return (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
                <div className="text-sm text-gray-600">
                    {currentLocation && (
                        <span className="font-medium">📍 {currentLocation}</span>
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    {restaurantCount} lugares encontrados
                </div>
            </div>

            {/* Radius Control */}
            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">Radio de búsqueda:</label>
                <select
                    value={searchRadius}
                    onChange={(e) => onRadiusChange(parseInt(e.target.value))}
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
    );
};

export default SearchControls;