import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function FooterComponent() {
  const footer = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && footer.current) {
      gsap.to(footer.current, {
        y: 0, // Position fixed at the bottom
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else if (!isOpen && footer.current) {
      gsap.to(footer.current, {
        y: 120,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={footer}
        className="z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2"
      >
        <div className="relative">
          {/* Div noire centrée au-dessus */}
          <div
            className="shadow-xs shadow-blue-400/20 absolute -top-25 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full cursor-pointer z-10 hover:bg-blue-800 transition-colors flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-700 hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>

          {/* Footer bleu */}
          <footer
            className="bg-blue-900 text-white py-6 w-screen"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="container mx-auto px-4 text-center">
              <p>
                &copy; 2025 File Transfer App - Transfert de fichiers sécurisé
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Les fichiers sont automatiquement supprimés après téléchargement
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
