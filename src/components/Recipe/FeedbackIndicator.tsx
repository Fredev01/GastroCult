import React, { type JSX } from 'react';
import { Search, MapPin, Utensils, Clock, Sparkles, Loader } from 'lucide-react';

interface FeedbackTypeConfig {
    icon: JSX.Element;
    animation: string;
    bgGradient: string;
    borderColor: string;
}

export interface FeedbackIndicatorProps<T extends string = string> {
    isLoading: boolean;
    message: string;
    type?: T;
    /**
     * Mapeo de tipos a configuración visual.
     * Si no se provee, se usará el `defaultConfig`.
     */
    config?: Record<T, FeedbackTypeConfig>;
}

function FeedbackIndicator<T extends string = string>({
    isLoading,
    message,
    type,
    config,
}: FeedbackIndicatorProps<T>) {
    if (!isLoading) return null;

    // Configuración por defecto para tipos comunes
    const defaultConfig: Record<string, FeedbackTypeConfig> = {
        loading: {
            icon: <Loader className="w-6 h-6 text-gray-500" />,
            animation: 'animate-spin',
            bgGradient: 'from-gray-50 to-gray-100',
            borderColor: 'border-gray-200',
        },
        searching: {
            icon: <Search className="w-6 h-6 text-blue-500" />,
            animation: 'animate-pulse',
            bgGradient: 'from-blue-50 to-indigo-100',
            borderColor: 'border-blue-200',
        },
        cooking: {
            icon: <Utensils className="w-6 h-6 text-orange-500" />,
            animation: 'animate-bounce',
            bgGradient: 'from-orange-50 to-red-100',
            borderColor: 'border-orange-200',
        },
        discovering: {
            icon: <Sparkles className="w-6 h-6 text-purple-500" />,
            animation: 'animate-spin',
            bgGradient: 'from-purple-50 to-pink-100',
            borderColor: 'border-purple-200',
        },
        mapping: {
            icon: <MapPin className="w-6 h-6 text-teal-500" />,
            animation: 'animate-ping',
            bgGradient: 'from-teal-50 to-cyan-100',
            borderColor: 'border-teal-200',
        },
        timing: {
            icon: <Clock className="w-6 h-6 text-green-500" />,
            animation: 'animate-pulse',
            bgGradient: 'from-green-50 to-emerald-100',
            borderColor: 'border-green-200',
        },
    };

    const uiConfig =
        (type && config?.[type]) ||
        (type && defaultConfig[type]) ||
        defaultConfig['loading'];

    const { icon, animation, bgGradient, borderColor } = uiConfig;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`relative bg-gradient-to-r ${bgGradient} rounded-2xl shadow-2xl border-2 ${borderColor} p-6 max-w-sm mx-auto`}>
                {/* Background animations */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -top-2 -right-2 w-24 h-24 bg-white bg-opacity-20 rounded-full animate-ping" />
                    <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className={`p-3 bg-white rounded-full shadow-lg mb-4 ${animation}`}>
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                        {message}
                    </h3>
                    <div className="flex space-x-1 mb-4">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedbackIndicator;
