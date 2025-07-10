import React from 'react';

interface LoadingIndicatorProps {
    isLoading: boolean;
    message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading, message }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm text-gray-600">{message}</span>
            </div>
        </div>
    );
};

export default LoadingIndicator;