
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
          fill="currentColor"
        >
          <path d="M12.031 0C5.385 0 0 5.388 0 12.031c0 2.651.865 5.105 2.33 7.039l-1.574 5.753 5.88-1.543A12.01 12.01 0 0012.031 24.06c6.643 0 12.028-5.388 12.028-12.029C24.059 5.388 18.674 0 12.031 0zm0 22.03c-2.227 0-4.301-.58-6.071-1.579l-.435-.246-3.486.914.931-3.398-.27-.428A9.975 9.975 0 012.03 12.03c0-5.524 4.475-10.001 9.999-10.001 5.526 0 10.002 4.477 10.002 10.001S17.557 22.03 12.031 22.03zm5.485-7.487c-.301-.151-1.782-.88-2.057-.98-.276-.101-.476-.151-.676.151-.201.301-.776.98-.952 1.18-.175.201-.351.226-.651.076-.301-.151-1.272-.469-2.423-1.501-.897-.803-1.503-1.794-1.678-2.095-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.301.301-.502.101-.201.05-.376-.025-.526-.075-.151-.676-1.631-.926-2.233-.244-.587-.492-.507-.676-.516-.176-.009-.376-.009-.576-.009s-.527.075-.802.376c-.276.301-1.053 1.029-1.053 2.51 0 1.481 1.078 2.912 1.228 3.113.151.201 2.124 3.243 5.144 4.545.719.31 1.279.495 1.716.634.721.23 1.378.197 1.896.119.58-.088 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.276-.201-.577-.352z" />
        </svg>
      </button>
    </div>
  );
}
