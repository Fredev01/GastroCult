import React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';
import type { Recipes } from '../../types';


interface CardRecipeProps {
    recipe: Recipes;
    onClick?: () => void;
}

const CardRecipe: React.FC<CardRecipeProps> = ({ recipe, onClick }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                        <ChefHat className="w-16 h-16 text-orange-400" />
                    </div>
                )}

                {/* Tags Overlay */}
                {/* {recipe.tags && recipe.tags.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-700 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                        {recipe.tags.length > 2 && (
                            <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-700 rounded-full">
                                +{recipe.tags.length - 2}
                            </span>
                        )}
                    </div>
                )} */}
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Recipe Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {recipe.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                </p>

                {/* Recipe Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.ingredients.length} ingredientes</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.instructions.length} pasos</span>
                    </div>
                </div>

                {/* Ingredients Preview */}
                <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes principales:</h4>
                    <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                            >
                                {ingredient.name}
                            </span>
                        ))}
                        {recipe.ingredients.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                                +{recipe.ingredients.length - 3} más
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardRecipe;