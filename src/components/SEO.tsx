import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    type?: 'website' | 'article';
    image?: string;
    noIndex?: boolean;
    schema?: Record<string, unknown> | Record<string, unknown>[];
}

export function SEO({
    title,
    description = "Find quality pre-owned cars at King Cars. 28+ brands with 2-year unlimited km warranty. Finance available. Branches in Cape Town & Port Elizabeth.",
    canonical,
    type = 'website',
    image = '/og-image.jpg',
    noIndex = false,
    schema,
}: SEOProps) {
    const siteTitle = 'King Cars';
    const fullTitle = title === siteTitle ? title : `${title} | King Cars`;
    const siteUrl = 'https://www.kingcars.co.za';
    const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;
    const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    const schemas = schema
        ? Array.isArray(schema) ? schema : [schema]
        : [];

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:site_name" content="King Cars" />
            <meta property="og:locale" content="en_ZA" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />

            {/* JSON-LD Schema */}
            {schemas.map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
}
