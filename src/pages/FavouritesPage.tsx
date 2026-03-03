import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FavouritesPageProps {
    favourites: string[];
    onToggleFavourite: (carId: string) => void;
}

import { SEO } from '@/components/SEO';

export function FavouritesPage({ favourites, onToggleFavourite }: FavouritesPageProps) {
    const navigate = useNavigate();
    const { loading, cars } = useInventory(); // We need the full inventory to match IDs

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-king-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const favouriteCars = cars.filter(car => favourites.includes(car.id));

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <SEO
                title="My Favourites"
                description="View your saved vehicles."
            // No index needed for favourites
            />
            <div className="section-padding">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-3xl text-gray-900">My Favourites</h1>
                        <p className="text-gray-500 mt-1">{favouriteCars.length} vehicles saved</p>
                    </div>
                </div>

                {favouriteCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favouriteCars.map(car => (
                            <CarCard
                                key={car.id}
                                car={car}
                                isFavourite={true}
                                onToggleFavourite={() => onToggleFavourite(car.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">No Favourites Yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            You haven't saved any vehicles yet. Browse our showroom and click the heart icon to save cars you're interested in.
                        </p>
                        <button
                            onClick={() => navigate('/showroom')}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            Browse Showroom
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
