import { useState } from 'react';
import { ColorPopup } from './ColorPopup';

export function GetColorfulButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      {/* Floating "Get Colorful" button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 z-40 font-semibold text-sm"
        style={{
          background: 'var(--color-accent)',
          color: 'var(--color-foreground)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        }}
      >
        🎨 Get Colorful
      </button>

      {/* Color popup */}
      <ColorPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </>
  );
} 