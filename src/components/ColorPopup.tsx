import { useState } from 'react';
import { generateTheme, applyThemeToSite, type Theme, type Mood } from '../utils/themeGenerator';

interface ColorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColorPopup({ isOpen, onClose }: ColorPopupProps) {
  const [currentMood, setCurrentMood] = useState<Mood>('none');
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const generateNewPalette = () => {
    setPreviewTheme(generateTheme(currentMood));
  };

  const applyPreview = () => {
    if (previewTheme) {
      applyThemeToSite(previewTheme);
      setPreviewTheme(null);
    }
  };

  const setMood = (mood: Mood) => {
    setCurrentMood(mood);
  };

  const activeTheme = previewTheme || {
    background: '#ffffff',
    foreground: '#000000',
    accent: '#3b82f6',
    highlight: '#f59e0b',
    card: '#f8fafc'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ background: activeTheme.card }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: activeTheme.highlight }}>
          <h2 className="text-2xl font-bold" style={{ color: activeTheme.accent }}>
            Get Colorful
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            style={{ color: activeTheme.foreground }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: activeTheme.foreground }}>
              Choose Your Mood:
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  currentMood === 'melancholy' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ 
                  background: currentMood === 'melancholy' ? activeTheme.accent : activeTheme.background,
                  color: currentMood === 'melancholy' ? activeTheme.foreground : activeTheme.foreground,
                  border: currentMood === 'melancholy' ? `2px solid ${activeTheme.accent}` : `2px solid ${activeTheme.highlight}`
                }}
                onClick={() => setMood('melancholy')}
              >
                🌊 Melancholy
              </button>
              
              <button
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  currentMood === 'euphoric' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ 
                  background: currentMood === 'euphoric' ? activeTheme.accent : activeTheme.background,
                  color: currentMood === 'euphoric' ? activeTheme.foreground : activeTheme.foreground,
                  border: currentMood === 'euphoric' ? `2px solid ${activeTheme.accent}` : `2px solid ${activeTheme.highlight}`
                }}
                onClick={() => setMood('euphoric')}
              >
                ✨ Euphoric
              </button>
              
              <button
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  currentMood === 'none' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ 
                  background: currentMood === 'none' ? activeTheme.accent : activeTheme.background,
                  color: currentMood === 'none' ? activeTheme.foreground : activeTheme.foreground,
                  border: currentMood === 'none' ? `2px solid ${activeTheme.accent}` : `2px solid ${activeTheme.highlight}`
                }}
                onClick={() => setMood('none')}
              >
                🎲 No Mood
              </button>
            </div>
          </div>

          {/* Color Palette Display */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: activeTheme.foreground }}>
              Color Palette
            </h3>
            <div className="flex gap-2 justify-center">
              <div className="w-12 h-12 rounded shadow-lg border" style={{ background: activeTheme.background }}>
                <div className="text-xs p-1 text-center text-black">BG</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg" style={{ background: activeTheme.foreground }}>
                <div className="text-xs p-1 text-center" style={{ color: activeTheme.background }}>FG</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg" style={{ background: activeTheme.accent }}>
                <div className="text-xs p-1 text-center text-black">ACC</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg" style={{ background: activeTheme.highlight }}>
                <div className="text-xs p-1 text-center text-black">HL</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg border" style={{ background: activeTheme.card }}>
                <div className="text-xs p-1 text-center text-black">CARD</div>
              </div>
            </div>
          </div>

          {/* Preview indicator */}
          {previewTheme && (
            <div className="p-3 rounded-lg text-center" style={{ background: activeTheme.highlight }}>
              <span className="text-sm font-semibold" style={{ color: activeTheme.foreground }}>
                🎨 Preview Mode - Click "Apply Theme" to use this palette
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                background: activeTheme.highlight, 
                color: activeTheme.foreground 
              }}
              onClick={generateNewPalette}
            >
              Generate New Palette
            </button>
            
            {previewTheme && (
              <button
                className="flex-1 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  background: activeTheme.accent, 
                  color: activeTheme.foreground 
                }}
                onClick={applyPreview}
              >
                Apply Theme
              </button>
            )}
          </div>

          {/* Theme Info */}
          <div className="p-4 rounded-lg" style={{ background: activeTheme.background }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: activeTheme.accent }}>
              {previewTheme ? 'Preview Theme' : 'Current Theme'}
            </h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex justify-between">
                <span className="font-mono text-black">Background:</span>
                <span className="font-mono text-black">{activeTheme.background}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Foreground:</span>
                <span className="font-mono text-black">{activeTheme.foreground}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Accent:</span>
                <span className="font-mono text-black">{activeTheme.accent}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Highlight:</span>
                <span className="font-mono text-black">{activeTheme.highlight}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Card:</span>
                <span className="font-mono text-black">{activeTheme.card}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 