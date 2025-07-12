import type { Recipes } from "../types";

// Desarrollar una funcion llamada searchRecipes que reciba la ubicación y retorne recetas relacionadas con esa ubicación. el metodo para la api debe ser POST, enviando un json con el campo "location" y el valor de la ubicación.
export const searchRecipes = async (location: string): Promise<Recipes[]> => {
    if (!location.trim()) {
        return [];
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/recipes/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        return results.recipes as Recipes[];
    } catch (error) {
        console.error('Error searching recipes:', error);
        return [];
    }
}