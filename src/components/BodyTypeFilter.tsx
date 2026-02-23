import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';

const bodyTypes = [
    {
        name: 'SUV',
        image: '/body-types/suv.png.png',
        category: 'SUV'
    },
    {
        name: 'HATCHBACK',
        image: '/body-types/hatchback.png.png',
        category: 'Hatchback'
    },
    {
        name: 'DOUBLE CAB',
        image: '/body-types/doublecab.png.png',
        category: 'Bakkie'
    },
    {
        name: 'SEDAN',
        image: '/body-types/sedan.png.png',
        category: 'Sedan'
    },
    {
        name: 'SINGLE CAB',
        image: '/body-types/singlecab.png.png',
        category: 'Bakkie'
    },
    {
        name: 'PANEL VAN / MINI',
        image: '/body-types/minivan.png.png',
        category: 'Bakkie'
    }
];

export function BodyTypeFilter() {
    const navigate = useNavigate();

    const handleTypeClick = (category: string) => {
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
            searchQuery: ''
        }));
        window.scrollTo(0, 0); // Force scroll to top, especially for mobile
        navigate('/showroom');
    };

    return (
        <section className="py-20 bg-king-blue">
            <div className="section-padding max-w-7xl mx-auto">
                <AnimatedSection className="text-center mb-16">
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                        Choose by body type
                    </h2>
                    <p className="text-blue-100 text-lg">
                        Click to filter our showroom by body type
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                    {bodyTypes.map((type, index) => (
                        <AnimatedSection
                            key={index}
                            delay={index * 100}
                            className="group"
                        >
                            <button
                                onClick={() => handleTypeClick(type.category)}
                                className="w-full bg-transparent hover:bg-white/50 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center"
                            >
                                <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-xl">
                                    <img
                                        src={type.image}
                                        alt=""
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
