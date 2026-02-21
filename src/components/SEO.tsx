import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    type?: 'website' | 'article';
    image?: string;
}

export function SEO({
    title,
    description = "Find your dream car at King Cars. We offer a wide range of quality used cars in Cape Town and Port Elizabeth. Finance available.",
    canonical,
    type = 'website',
    image = '/og-image.jpg' // We should ensure this image exists or use a logo
}: SEOProps) {
    const siteTitle = 'King Cars | Quality Used Cars';
    const fullTitle = title === siteTitle ? title : `${title} | King Cars`;
    const currentUrl = window.location.href;
    const canonicalUrl = canonical || currentUrl;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="King Cars" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
