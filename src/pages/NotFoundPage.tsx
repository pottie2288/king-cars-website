import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Browse our showroom or contact King Cars."
        noIndex={true}
      />
      <div className="text-center px-6">
        <h1 className="font-display font-bold text-6xl text-king-blue mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find that page. Let's get you back on the road.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-king-blue text-white rounded-lg font-medium hover:bg-king-blue/90 transition-colors"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate('/showroom')}
            className="px-6 py-3 bg-white text-king-blue border border-king-blue rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Browse Showroom
          </button>
        </div>
      </div>
    </div>
  );
}
