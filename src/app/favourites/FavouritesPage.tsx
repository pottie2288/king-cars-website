'use client'

import { useEffect, useMemo, useState } from 'react';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFavourites } from '@/context/FavouritesContext';

/** Cars per page — one full row on every breakpoint up to xl (4 columns). */
const PAGE_SIZE = 12;

export function FavouritesPage() {
    const router = useRouter();
    const { favourites, toggleFavourite } = useFavourites();
    const { loading, cars } = useInventory();
    const [page, setPage] = useState(1);

    const favouriteCars = useMemo(
        () => cars.filter(car => favourites.includes(car.id)),
        [cars, favourites]
    );

    const totalPages = Math.max(1, Math.ceil(favouriteCars.length / PAGE_SIZE));

    // Removing the last favourite on the final page would otherwise strand the
    // user on an empty page with no way back.
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const visibleCars = favouriteCars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goToPage = (next: number) => {
        setPage(Math.min(Math.max(1, next), totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 sm:pt-36 px-4 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-king-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        // pt-32/36 clears the fixed header with room to breathe, matching the
        // Contact and POPI pages. pt-24 left the title crowded under the nav.
        <div className="min-h-screen bg-gray-50 pt-32 sm:pt-36 pb-12">
            <div className="section-padding">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-3xl text-gray-900">My Favourites</h1>
                        <p className="text-gray-500 mt-1">
                            {favouriteCars.length} vehicle{favouriteCars.length === 1 ? '' : 's'} saved
                            {totalPages > 1 && ` — page ${page} of ${totalPages}`}
                        </p>
                    </div>
                </div>

                {favouriteCars.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleCars.map(car => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    isFavourite={true}
                                    onToggleFavourite={() => toggleFavourite(car.id)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav
                                className="mt-10 flex items-center justify-center gap-2"
                                aria-label="Favourites pagination"
                            >
                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page === 1}
                                    className="flex items-center gap-1 px-4 h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => goToPage(pageNumber)}
                                            aria-current={pageNumber === page ? 'page' : undefined}
                                            className={`h-10 min-w-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                                                pageNumber === page
                                                    ? 'bg-king-blue text-white'
                                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page === totalPages}
                                    className="flex items-center gap-1 px-4 h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Next page"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">No Favourites Yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            You haven&apos;t saved any vehicles yet. Browse our showroom and click the heart icon to save cars you&apos;re interested in.
                        </p>
                        <button
                            onClick={() => router.push('/showroom')}
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
