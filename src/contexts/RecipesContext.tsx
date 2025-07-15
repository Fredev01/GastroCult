// contexts/RecipesContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Recipes } from '../types';

interface RecipesContextType {
    recipes: Recipes[];
    setRecipes: (recipes: Recipes[]) => void;
    currentLocation: string;
    setCurrentLocation: (location: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

const useRecipes = () => {
    const context = useContext(RecipesContext);
    if (!context) {
        throw new Error('useRecipes must be used within a RecipesProvider');
    }
    return context;
};

interface RecipesProviderProps {
    children: ReactNode;
}

const RecipesProvider: React.FC<RecipesProviderProps> = ({ children }) => {
    const [recipes, setRecipes] = useState<Recipes[]>([]);
    const [currentLocation, setCurrentLocation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const value = {
        recipes,
        setRecipes,
        currentLocation,
        setCurrentLocation,
        isLoading,
        setIsLoading
    };

    return (
        <RecipesContext.Provider value={value}>
            {children}
        </RecipesContext.Provider>
    );
};

export { useRecipes, RecipesProvider };