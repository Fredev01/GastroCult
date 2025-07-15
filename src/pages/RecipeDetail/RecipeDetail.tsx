import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { Recipes } from '../../types';

function RecipeDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const recipe = location.state?.recipe as Recipes;

    useEffect(() => {
        // Redirigir al home si no hay receta
        if (!recipe) {
            navigate('/');
        }
    }, [recipe, navigate]);

    if (!recipe) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header con botón de regreso */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Regresar
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Imagen de la receta */}
                    {recipe.imageUrl && (
                        <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-lg">
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6">

                        {/* Descripción */}
                        {recipe.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">Descripción</h2>
                                <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
                            </div>
                        )}

                        {/* Ingredientes */}
                        {recipe.ingredients && recipe.ingredients.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredientes</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <ul className="space-y-3">
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <div className="flex-1">
                                                    <span className="text-gray-700 ml-2">{ingredient.name} </span>
                                                    <span className="font-medium text-gray-900">{ingredient.quantity}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Instrucciones */}
                        {recipe.instructions && recipe.instructions.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Instrucciones</h2>
                                <div className="space-y-4">
                                    {recipe.instructions.map((instruction, index) => (
                                        <div key={index} className="flex items-start">
                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-medium mr-4 flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notas adicionales - removida ya que no existe en la interfaz */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;