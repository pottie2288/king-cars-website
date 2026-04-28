'use client'

import { useRouter } from 'next/navigation';
import { AnimatedSection } from './AnimatedSection';
import { BODY_TYPES } from '@/data/body-types';

export function BodyTypeFilter() {
    const router = useRouter();

    const handleTypeClick = (category: string, doors: number | null) => {
        sessionStorage.setItem('homeSearchFilters', JSON.stringify({
            category: category,
            location: null,
            make: null,
            model: null,
            minPrice: null,
            maxPrice: null,
            minYear: null,
            maxYear: null,
            maxMileage: null,
            doors: doors,
            searchQuery: ''
        }));
        router.push('/showroom');
    };

    return (
        <section className="pt-8 pb-20 bg-king-blue">
            <div className="section-padding max-w-7xl mx-auto">
                <AnimatedSection className="text-center mb-8">
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                        Choose by body type
                    </h2>
                </AnimatedSection>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                    {BODY_TYPES.map((type, index) => (
                        <AnimatedSection
                            key={index}
                            delay={index * 100}
                            className="group"
                        >
                            <button
                                onClick={() => handleTypeClick(type.category, type.doors ?? null)}
                                className="w-full bg-transparent hover:bg-white/50 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center"
                            >
                                <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-xl">
                                    <img
                                        src={type.image}
                                        alt={`${type.name} vehicles at King Cars`}
                                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="font-display font-bold text-sm sm:text-base text-white tracking-wider">
                                    {type.name}
                                </span>
                            </button>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
