import { useNavigate } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection';

const bodyTypes = [
    {
        name: 'SUV',
        image: '/cars/hyundai-tucson.jpg', // Realistic dark blue SUV
        category: 'SUV'
    },
    {
        name: 'HATCHBACK',
        image: '/cars/vw-golf.jpg', // Realistic red hatchback
        category: 'Hatchback'
    },
    {
        name: 'DOUBLE CAB',
        image: '/cars/toyota-hilux.jpg', // Realistic white bakkie (will look for color later, hilux is iconic)
        category: 'Bakkie'
    },
    {
        name: 'SEDAN',
        image: '/cars/bmw-3series.jpg', // Realistic blue sedan
        category: 'Sedan'
    },
    {
        name: 'MPV',
        image: '/cars/hyundai-tucson.jpg', // Placeholder for MPV
        category: 'SUV'
    },
    {
        name: 'LWB / EXTRA CAB',
        image: '/cars/ford-ranger.jpg', // Realistic grey bakkie 
        category: 'Bakkie'
    },
    {
        name: 'CROSSOVER',
        image: '/cars/nissan-qashqai.jpg', // Realistic grey crossover
        category: 'SUV'
    },
    {
        name: 'PANEL VAN / MINI',
        image: '/cars/ford-ranger.jpg', // Placeholder for Van
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
        navigate('/showroom');
    };

    return (
        <section className="py-20 bg-gray-100">
            <div className="section-padding max-w-7xl mx-auto">
                <AnimatedSection className="text-center mb-16">
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
                        Choose by body type
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Click to filter our showroom by body type
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
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
                                        alt={type.name}
                                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="font-display font-bold text-sm sm:text-base text-gray-800 tracking-wider">
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
