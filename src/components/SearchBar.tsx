import React from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import type { SearchResult } from '../types';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onSearch: (e: React.FormEvent | React.KeyboardEvent) => void;
    isLoading: boolean;
    searchResults: SearchResult[];
    onPlaceSelect: (result: SearchResult) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    onSearch,
    isLoading,
    searchResults,
    onPlaceSelect
}) => {
    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch(e)}
                    placeholder="Buscar ciudad, lugar o dirección..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {isLoading && (
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
                            onClick={() => onPlaceSelect(result)}
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
    );
};

export default SearchBar;