import { MessageCircle } from 'lucide-react';

export function StickyContactBar() {
  const whatsappNumber = '+27215551234';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi King Cars! I\'m interested in viewing your vehicles.');
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <button
        onClick={handleWhatsAppClick}
        className="w-[60px] h-[60px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg transition-transform shine-effect active:scale-95"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
}
