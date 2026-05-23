import type { MetadataRoute } from 'next';
import type { VmgVehicle } from '@/types';

const VMG_API_URL =
    'https://vmgplay.co.za/api/v3/view_stock_complete_with_data?company_id=in.(133,209,153,154)';

const BASE_URL = 'https://www.kingcars.co.za';

const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/showroom`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/finance`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/favourites`, lastModified: new Date(), changeFrequency: 'never', priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const res = await fetch(VMG_API_URL, { next: { revalidate: 300 } });
        if (!res.ok) return staticPages;

        const vehicles: VmgVehicle[] = await res.json();

        const carPages: MetadataRoute.Sitemap = vehicles.map(v => ({
            url: `${BASE_URL}/showroom/${v.stock_id}`,
            lastModified: v.date_updated ? new Date(v.date_updated) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));

        return [...staticPages, ...carPages];
    } catch {
        return staticPages;
    }
}
