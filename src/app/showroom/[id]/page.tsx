import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { VmgVehicle } from '@/types';
import { CarDetailPage } from './CarDetailPage';

const VMG_API_URL =
    'https://vmgplay.co.za/api/v3/view_stock_complete_with_data?company_id=in.(133,209,153,154)';

const BASE_URL = 'https://www.kingcars.co.za';

async function fetchVehicle(id: string): Promise<VmgVehicle | null> {
    try {
        const res = await fetch(VMG_API_URL, { next: { revalidate: 300 } });
        if (!res.ok) return null;
        const vehicles: VmgVehicle[] = await res.json();
        return vehicles.find(v => String(v.stock_id) === id) ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const v = await fetchVehicle(id);

    if (!v) {
        return {
            title: 'Vehicle Not Found — King Cars',
            description: 'This vehicle could not be found. Browse our full inventory at King Cars.',
        };
    }

    const price = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(v.selling_price);

    const mileage = new Intl.NumberFormat('en-ZA').format(v.mileage);
    const title = `${v.year} ${v.make} ${v.series} — ${price} | King Cars`;
    const description = `${v.year} ${v.make} ${v.series} for sale at King Cars ${v.province}. ${price}. ${mileage} km. Finance available. View photos and enquire online.`;
    const canonicalUrl = `${BASE_URL}/showroom/${v.stock_id}`;

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: v.url1
                ? [{ url: v.url1, width: 1200, height: 800, alt: `${v.year} ${v.make} ${v.series}` }]
                : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: v.url1 ? [v.url1] : [],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const v = await fetchVehicle(id);

    if (!v) notFound();

    const canonicalUrl = `${BASE_URL}/showroom/${v.stock_id}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': ['Product', 'Car'],
        name: `${v.year} ${v.make} ${v.series}`,
        brand: { '@type': 'Brand', name: v.make },
        model: v.series,
        modelDate: String(v.year),
        color: v.colour,
        sku: v.stock_code ?? String(v.stock_id),
        itemCondition: 'https://schema.org/UsedCondition',
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: v.mileage,
            unitCode: 'KMT',
        },
        vehicleTransmission: v.transmission,
        fuelType: v.fuel_type,
        bodyType: v.body_type,
        numberOfDoors: v.doors,
        image: [v.url1, v.url2, v.url3].filter(Boolean),
        offers: {
            '@type': 'Offer',
            price: v.selling_price,
            priceCurrency: 'ZAR',
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
            seller: { '@type': 'AutoDealer', name: 'King Cars', url: BASE_URL },
        },
        description: `${v.year} ${v.make} ${v.series} for sale at King Cars ${v.province}. ${new Intl.NumberFormat('en-ZA').format(v.mileage)} km. Finance available.`,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CarDetailPage initialVehicle={v} />
        </>
    );
}
