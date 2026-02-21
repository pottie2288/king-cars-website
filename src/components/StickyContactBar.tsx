import { Phone, MessageCircle } from 'lucide-react';

export function StickyContactBar() {
  const whatsappNumber = '+27215551234';
  const phoneNumber = '+27215551234';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi King Cars! I\'m interested in viewing your vehicles.');
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center">
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-medium transition-all click-press shine-effect"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
          <div className="w-px h-12 bg-white/30" />
          <button
            onClick={handleCallClick}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-king-blue text-white font-medium transition-all click-press shine-effect"
          >
            <Phone className="w-5 h-5" />
            <span>Call Now</span>
          </button>
        </div>
        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </div>
    </div>
  );
}
