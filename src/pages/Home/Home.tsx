// pages/Home/Home.tsx
import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPlaces } from '../../services/osmApi';
import SearchBar from '../../components/SearchBar';
import { searchRecipes } from '../../services/recipeApi';
import type { Recipes, SearchResult } from '../../types';
import CardRecipe from '../../components/Recipe/CardRecipe';
import FeedbackIndicator from '../../components/Recipe/FeedbackIndicator';
import { useRecipes } from '../../contexts/RecipesContext';
import { getUserLocation } from '../../utils/getLocation';

function Home() {
    const navigate = useNavigate();
    const {
        recipes,
        setRecipes,
        currentLocation,
        setCurrentLocation,
        isLoading: isLoadingRecipes,
        setIsLoading: setIsLoadingRecipes
    } = useRecipes();

    const [searchTerm, setSearchTerm] = useState(currentLocation);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

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
        setSearchResults([]);
        setSearchTerm(result.display_name);
        setCurrentLocation(result.display_name);
        await fetchRecipes(result.display_name);
    };

    const fetchRecipes = async (location: string) => {
        console.log(`Fetching recipes for location: ${location}`);
        setIsLoadingRecipes(true);
        try {
            const recipeData = await searchRecipes(location);
            console.log('Fetched recipes:', recipeData);
            setRecipes(recipeData);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setRecipes([]);
        } finally {
            setIsLoadingRecipes(false);
        }
    };

    const handleRecipeClick = (recipe: Recipes) => {
        // Navegar a la página de detalle pasando la receta como state
        navigate('/recipeDetail', { state: { recipe } });
    };

    useEffect(() => {
        // Solo cargar recetas si no hay recetas en el contexto
        if (recipes.length === 0) {
            const initializeRecipes = async () => {
                await fetchRecipes(currentLocation);
            };
            initializeRecipes();
        }
    }, [recipes.length, currentLocation]);

    // Sincronizar searchTerm con currentLocation cuando se regrese de otra página
    useEffect(() => {
        setSearchTerm(currentLocation);
    }, [currentLocation]);

    useEffect(() => {
        // const {} =  await getUserLocation();\
        if (recipes.length === 0) {
            const initializeLocation = async () => {
                const location = await getUserLocation();
                setCurrentLocation(location.placeName);
                setSearchTerm(location.placeName);
            };
            initializeLocation();
        }
    }, [recipes.length]);

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
                </div>
            </div>

            {/* Recipes Section */}
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Recetas Disponibles
                        </h2>
                        <p className="text-gray-600">
                            {currentLocation ? `Recetas de ${currentLocation}` : 'Recetas locales'}
                        </p>
                    </div>

                    {/* Recipes Grid */}
                    {!isLoadingRecipes && recipes.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recipes.map((recipe) => (
                                <CardRecipe
                                    key={recipe.id || recipe.name}
                                    recipe={recipe}
                                    onClick={() => handleRecipeClick(recipe)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoadingRecipes && recipes.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay recetas disponibles
                            </h3>
                            <p className="text-gray-600">
                                Intenta buscar en otra ubicación o verifica tu conexión.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Indicator */}
            <FeedbackIndicator
                isLoading={isLoadingRecipes}
                message="Buscando recetas..."
                type="searching"
            />
        </div>
    );
}

export default Home;