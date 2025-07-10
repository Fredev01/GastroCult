import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const RestaurantIcon = L.divIcon({
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

export const CafeIcon = L.divIcon({
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

export const FastFoodIcon = L.divIcon({
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
