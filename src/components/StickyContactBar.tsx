
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path d="M16 14.5c-.5.3-1.1.5-1.7.5-.6 0-1.8-.7-3-1.9-1.2-1.2-1.9-2.4-1.9-3 0-.6.2-1.2.5-1.7.1-.2.1-.4 0-.5l-1-2.4c-.1-.2-.4-.3-.6-.3-.3 0-.8.1-1.1.4-.4.4-.7 1-.7 1.8 0 1.9 1.4 4.5 3.3 6.4 1.9 1.9 4.5 3.3 6.4 3.3.8 0 1.4-.3 1.8-.7.3-.3.4-.8.4-1.1 0-.2-.1-.5-.3-.6l-2.4-1c-.2-.1-.4-.1-.5 0z" />
        </svg>
      </button>
    </div>
  );
}
