import chroma from 'chroma-js';
import { type Theme } from './themeGenerator';

export interface ExportedTheme {
  id: string;
  name: string;
  createdAt: string;
  colors: {
    background: ColorFormats;
    foreground: ColorFormats;
    accent: ColorFormats;
    highlight: ColorFormats;
    card: ColorFormats;
  };
  metadata: {
    version: string;
    exportedAt: string;
    totalThemes: number;
  };
}

export interface ColorFormats {
  hex: string;
  rgb: { r: number; g: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  hsl: { h: number; s: number; l: number };
}

// Convert hex to all color formats
function convertColorFormats(hexColor: string): ColorFormats {
  const color = chroma(hexColor);
  const [r, g, b] = color.rgb();
  const [c, m, y, k] = color.cmyk();
  const [h, s, l] = color.hsl();
  
  return {
    hex: hexColor,
    rgb: { r, g, b },
    cmyk: { c, m, y, k },
    hsl: { h, s, l }
  };
}

// Generate PNG data URL for a color (unused - keeping for potential future use)
// function generateColorPNG(hexColor: string): string {
//   const canvas = document.createElement('canvas');
//   canvas.width = 100;
//   canvas.height = 100;
//   const ctx = canvas.getContext('2d')!;
//   
//   // Fill with color
//   ctx.fillStyle = hexColor;
//   ctx.fillRect(0, 0, 100, 100);
//   
//   // Add border
//   ctx.strokeStyle = '#333';
//   ctx.lineWidth = 2;
//   ctx.strokeRect(1, 1, 98, 98);
//   
//   return canvas.toDataURL('image/png');
// }

// Export themes with all color formats
export function exportThemes(themes: Array<Theme & { id: string; name: string; createdAt: string }>): ExportedTheme[] {
  return themes.map(theme => ({
    id: theme.id,
    name: theme.name,
    createdAt: theme.createdAt,
    colors: {
      background: convertColorFormats(theme.background),
      foreground: convertColorFormats(theme.foreground),
      accent: convertColorFormats(theme.accent),
      highlight: convertColorFormats(theme.highlight),
      card: convertColorFormats(theme.card)
    },
    metadata: {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      totalThemes: themes.length
    }
  }));
}

// Download themes as JSON file
export function downloadThemes(themes: Array<Theme & { id: string; name: string; createdAt: string }>): void {
  const exportedThemes = exportThemes(themes);
  const dataStr = JSON.stringify(exportedThemes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `thematic-colors-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

// Import themes from JSON file
export function importThemes(file: File): Promise<Array<Theme & { id: string; name: string; createdAt: string }>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData: ExportedTheme[] = JSON.parse(e.target?.result as string);
        
        // Convert back to internal format
        const themes = importedData.map(importedTheme => ({
          id: importedTheme.id,
          name: importedTheme.name,
          createdAt: importedTheme.createdAt,
          background: importedTheme.colors.background.hex,
          foreground: importedTheme.colors.foreground.hex,
          accent: importedTheme.colors.accent.hex,
          highlight: importedTheme.colors.highlight.hex,
          card: importedTheme.colors.card.hex
        }));
        
        resolve(themes);
      } catch (error) {
        reject(new Error('Invalid theme file format'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Generate PNG preview of theme
export function generateThemePNG(theme: Theme): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  
  // Background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, 800, 400);
  
  // Color swatches with color information
  const colors = [
    { color: theme.background, label: 'Background', name: 'background' },
    { color: theme.foreground, label: 'Foreground', name: 'foreground' },
    { color: theme.accent, label: 'Accent', name: 'accent' },
    { color: theme.highlight, label: 'Highlight', name: 'highlight' },
    { color: theme.card, label: 'Card', name: 'card' }
  ];
  
  colors.forEach((colorInfo, index) => {
    const x = 50 + (index * 140);
    const y = 80;
    
    // Color swatch
    ctx.fillStyle = colorInfo.color;
    ctx.fillRect(x, y, 100, 100);
    
    // Border
    ctx.strokeStyle = theme.foreground;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, 100, 100);
    
    // Label
    ctx.fillStyle = theme.foreground;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(colorInfo.label, x + 50, y + 125);
    
    // Color codes
    const color = chroma(colorInfo.color);
    const [r, g, b] = color.rgb();
    const [c, m, y_val, k] = color.cmyk();
    
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    
    // Hex code
    ctx.fillStyle = theme.accent;
    ctx.fillText(`HEX: ${colorInfo.color}`, x, y + 145);
    
    // RGB code
    ctx.fillStyle = theme.foreground;
    ctx.fillText(`RGB: ${r}, ${g}, ${b}`, x, y + 160);
    
    // CMYK code
    ctx.fillText(`CMYK: ${c.toFixed(2)}, ${m.toFixed(2)}, ${y_val.toFixed(2)}, ${k.toFixed(2)}`, x, y + 175);
  });
  
  // Title
  ctx.fillStyle = theme.accent;
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Thematic Colors Theme', 400, 40);
  
  // Subtitle with date
  ctx.fillStyle = theme.foreground;
  ctx.font = '14px Arial';
  ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, 400, 60);
  
  return canvas.toDataURL('image/png');
}

// Download individual theme as PNG
export function downloadThemePNG(theme: Theme, name: string): void {
  const pngDataUrl = generateThemePNG(theme);
  const link = document.createElement('a');
  link.href = pngDataUrl;
  link.download = `${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
  link.click();
} 