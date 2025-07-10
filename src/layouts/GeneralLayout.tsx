import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
    ChefHat,
    MapPin,
    Calendar,
    User,
    Home
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GeneralLayoutProps {
    children: ReactNode;
}

interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
}

function GeneralLayout({ children }: GeneralLayoutProps) {
    const location = useLocation();

    const navItems: NavItem[] = [
        {
            path: '/',
            label: 'Recetas',
            icon: ChefHat
        },
        {
            path: '/map',
            label: 'Mapa de comidas',
            icon: MapPin
        },
        {
            path: '/events',
            label: 'Eventos',
            icon: Calendar
        }
    ];

    const isActivePath = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="min-h-[calc(100vh-2rem)] bg-white rounded-xl shadow-xl flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gradient-to-b from-purple-300 to-pink-300 rounded-l-xl relative">
                    <div className="p-6">
                        {/* Logo/Brand */}
                        <div className="flex items-center mb-8">
                            <Home className="h-8 w-8 text-purple-800 mr-3" />
                            <h1 className="text-xl font-bold text-purple-800">
                                Sabores Culturales
                            </h1>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = isActivePath(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive
                                                ? 'bg-white bg-opacity-30 text-purple-900 shadow-md'
                                                : 'text-purple-800 hover:bg-white hover:bg-opacity-20 hover:text-purple-900'
                                            }
                    `}
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer del sidebar */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-center text-purple-800 text-sm opacity-75">
                            <p>© 2024 Sabores Culturales</p>
                            <p>Preservando tradiciones</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col bg-gray-50">
                    {/* Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {navItems.find(item => isActivePath(item.path))?.label || 'Inicio'}
                                </h2>
                            </div>

                            {/* User Profile Button */}
                            <button className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors duration-200 shadow-md">
                                <User className="h-5 w-5" />
                            </button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GeneralLayout;