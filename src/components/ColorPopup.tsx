import { useState, useEffect } from 'react';
import { generateTheme, applyThemeToSite, type Theme, type Mood } from '../utils/themeGenerator';

function getCurrentThemeFromCSSVars(): Theme {
  const root = document.documentElement;
  return {
    background: getComputedStyle(root).getPropertyValue('--color-background').trim() || '#ffffff',
    foreground: getComputedStyle(root).getPropertyValue('--color-foreground').trim() || '#000000',
    accent: getComputedStyle(root).getPropertyValue('--color-accent').trim() || '#3b82f6',
    highlight: getComputedStyle(root).getPropertyValue('--color-highlight').trim() || '#f59e0b',
    card: getComputedStyle(root).getPropertyValue('--color-card').trim() || '#f8fafc',
  };
}

interface ColorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColorPopup({ isOpen, onClose }: ColorPopupProps) {
  const [currentMood, setCurrentMood] = useState<Mood>('none');
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewTheme(null);
    }
  }, [isOpen]);

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

  // Use getCurrentThemeFromCSSVars for swatches and info
  const appliedTheme = getCurrentThemeFromCSSVars();
  
  // Use preview theme for display if available, otherwise use applied theme
  const displayTheme = previewTheme || appliedTheme;

  // For swatches, always use previewTheme if it exists, otherwise appliedTheme
  const swatchTheme = previewTheme || appliedTheme;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ background: displayTheme.card }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: displayTheme.highlight }}>
          <h2 className="text-2xl font-bold" style={{ color: displayTheme.accent }}>
            Get Colorful
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            style={{ color: displayTheme.foreground }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: displayTheme.foreground }}>
              Choose Your Mood:
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                  currentMood === 'melancholy' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ 
                  background: currentMood === 'melancholy' ? displayTheme.accent : displayTheme.background,
                  color: currentMood === 'melancholy' ? displayTheme.foreground : displayTheme.foreground,
                  border: currentMood === 'melancholy' ? `2px solid ${displayTheme.accent}` : `2px solid ${displayTheme.highlight}`
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
                  background: currentMood === 'euphoric' ? displayTheme.accent : displayTheme.background,
                  color: currentMood === 'euphoric' ? displayTheme.foreground : displayTheme.foreground,
                  border: currentMood === 'euphoric' ? `2px solid ${displayTheme.accent}` : `2px solid ${displayTheme.highlight}`
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
                  background: currentMood === 'none' ? displayTheme.accent : displayTheme.background,
                  color: currentMood === 'none' ? displayTheme.foreground : displayTheme.foreground,
                  border: currentMood === 'none' ? `2px solid ${displayTheme.accent}` : `2px solid ${displayTheme.highlight}`
                }}
                onClick={() => setMood('none')}
              >
                🎲 No Mood
              </button>
            </div>
          </div>

          {/* Color Palette Display */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: displayTheme.foreground }}>
              {previewTheme ? 'Preview Palette' : 'Current Palette'}
            </h3>
            <div className="flex gap-2 justify-center">
              <div className="w-12 h-12 rounded shadow-lg border" style={{ background: swatchTheme.background }}>
                <div className="text-xs p-1 text-center" style={{ color: displayTheme.foreground }}>BG</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg" style={{ background: swatchTheme.foreground }}>
                <div className="text-xs p-1 text-center" style={{ color: displayTheme.background }}>FG</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg" style={{ background: swatchTheme.accent }}>
                <div className="text-xs p-1 text-center" style={{ color: displayTheme.foreground }}>ACC</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg" style={{ background: swatchTheme.highlight }}>
                <div className="text-xs p-1 text-center" style={{ color: displayTheme.foreground }}>HL</div>
              </div>
              <div className="w-12 h-12 rounded shadow-lg border" style={{ background: swatchTheme.card }}>
                <div className="text-xs p-1 text-center" style={{ color: displayTheme.foreground }}>CARD</div>
              </div>
            </div>
          </div>

          {/* Preview indicator */}
          {previewTheme && (
            <div className="p-3 rounded-lg text-center" style={{ background: displayTheme.highlight }}>
              <span className="text-sm font-semibold" style={{ color: displayTheme.foreground }}>
                🎨 Preview Mode - Click "Apply Theme" to use this palette
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                background: displayTheme.highlight, 
                color: displayTheme.foreground 
              }}
              onClick={generateNewPalette}
            >
              Generate New Palette
            </button>
            
            {previewTheme && (
              <button
                className="flex-1 px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  background: displayTheme.accent, 
                  color: displayTheme.foreground 
                }}
                onClick={applyPreview}
              >
                Apply Theme
              </button>
            )}
          </div>

          {/* Theme Info */}
          <div className="p-4 rounded-lg" style={{ background: displayTheme.background }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: displayTheme.accent }}>
              {previewTheme ? 'Preview Theme' : 'Current Theme'}
            </h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex justify-between">
                <span className="font-mono text-black">Background:</span>
                <span className="font-mono text-black">{displayTheme.background}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Foreground:</span>
                <span className="font-mono text-black">{displayTheme.foreground}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Accent:</span>
                <span className="font-mono text-black">{displayTheme.accent}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Highlight:</span>
                <span className="font-mono text-black">{displayTheme.highlight}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-black">Card:</span>
                <span className="font-mono text-black">{displayTheme.card}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 