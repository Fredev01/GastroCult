import { Utensils, Coffee } from 'lucide-react';
import { RestaurantIcon, CafeIcon, FastFoodIcon } from '../constants/icons';

export const getRestaurantIcon = (type: string) => {
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

export const getPlaceIconComponent = (type: string) => {
    switch (type) {
        case 'restaurant':
            return Utensils;
        case 'cafe':
            return Coffee;
        case 'fast_food':
            return Coffee;
        default:
            return Utensils;
    }
};

export const translateAmenityType = (type: string): string => {
    const translations: Record<string, string> = {
        restaurant: 'Restaurante',
        cafe: 'Café',
        fast_food: 'Comida rápida',
        pub: 'Pub',
        bar: 'Bar'
    };
    return translations[type] || type;
};