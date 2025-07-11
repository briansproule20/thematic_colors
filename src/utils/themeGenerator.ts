import chroma from 'chroma-js';

// Strongly typed theme structure with five-color palette
export interface Theme {
  background: string;
  foreground: string;
  accent: string;
  highlight: string;
  card: string;
}

// Mood types for color generation
export type Mood = 'melancholy' | 'euphoric' | 'none';

// Generate a random accessible five-color theme with high-contrast fg/bg
export function generateTheme(mood: Mood = 'none'): Theme {
  // Randomly decide if background is light or dark
  const isLightMode = Math.random() < 0.5;
  // Pick a random hue for the base color
  const baseHue = Math.floor(Math.random() * 360);
  
  // Add warm/cool temperature bias based on mood
  let temperatureBias: 'warm' | 'cool';
  switch (mood) {
    case 'melancholy':
      temperatureBias = 'cool';
      break;
    case 'euphoric':
      temperatureBias = 'warm';
      break;
    case 'none':
    default:
      temperatureBias = Math.random() < 0.5 ? 'warm' : 'cool';
      break;
  }
  
  const warmHues = [0, 10, 20, 30, 40, 50, 60, 350, 360]; // Reds, oranges, yellows (emphasized for euphoric)
  const coolHues = [200, 210, 220, 230, 240, 250, 260, 270, 280, 290]; // Blues, indigos, violets (emphasized for melancholy)
  
  // Generate a background color with more variation
  const bgSaturation = 0.08 + Math.random() * 0.20; // 0.08-0.28 range
  const bgLightness = isLightMode 
    ? 0.88 + Math.random() * 0.10 // 0.88-0.98 range
    : 0.05 + Math.random() * 0.15; // 0.05-0.20 range
  
  const background = chroma.hsl(baseHue, bgSaturation, bgLightness).hex();

  // Try to find a foreground color with high contrast and more variety
  let foreground: string = '';
  let attempts = 0;
  while (attempts < 15) { // Increased attempts
    // Allow foreground to be any hue, not just base hue
    const fgHue = Math.floor(Math.random() * 360);
    const fgLum = isLightMode
      ? 0.05 + Math.random() * 0.15 // 0.05-0.20 range
      : 0.85 + Math.random() * 0.12; // 0.85-0.97 range
    const fgSat = 0.05 + Math.random() * 0.25; // 0.05-0.30 range
    const fg = chroma.hsl(fgHue, fgSat, fgLum).hex();
    if (chroma.contrast(background, fg) >= 7) {
      foreground = fg;
      break;
    }
    attempts++;
  }
  // Fallback to black/white if not found
  if (!foreground) {
    foreground = isLightMode ? '#181818' : '#fafafa';
  }

  // Accent with temperature bias and more variation
  let accentHue: number;
  if (temperatureBias === 'warm') {
    accentHue = warmHues[Math.floor(Math.random() * warmHues.length)];
  } else {
    accentHue = coolHues[Math.floor(Math.random() * coolHues.length)];
  }
  
  const accentSaturation = 0.55 + Math.random() * 0.35; // 0.55-0.90 range
  const accentLightness = isLightMode 
    ? 0.35 + Math.random() * 0.25 // 0.35-0.60 range
    : 0.45 + Math.random() * 0.25; // 0.45-0.70 range
  
  const accent = chroma.hsl(accentHue, accentSaturation, accentLightness).hex();
  
  // Enhanced highlight options with more color theory relationships
  const accentComplement = (accentHue + 180) % 360;
  const accentTriadic1 = (accentHue + 120) % 360;
  const accentTriadic2 = (accentHue + 240) % 360;
  const accentAnalogous1 = (accentHue + 30) % 360;
  const accentAnalogous2 = (accentHue - 30 + 360) % 360;
  const accentSplit1 = (accentHue + 150) % 360; // Split complementary
  const accentSplit2 = (accentHue + 210) % 360; // Split complementary
  const accentTetradic1 = (accentHue + 90) % 360; // Tetradic (square)
  const accentTetradic2 = (accentHue + 180) % 360; // Tetradic
  const accentTetradic3 = (accentHue + 270) % 360; // Tetradic
  const accentMonochromatic = accentHue; // Same hue, different saturation/lightness
  
  // Add some random variation to temperature bias
  const highlightOptions = temperatureBias === 'warm' 
    ? [accentComplement, accentTriadic1, accentTriadic2, accentAnalogous1, accentAnalogous2, accentSplit1, accentSplit2, accentTetradic1, accentTetradic2, accentTetradic3, accentMonochromatic, ...warmHues]
    : [accentComplement, accentTriadic1, accentTriadic2, accentAnalogous1, accentAnalogous2, accentSplit1, accentSplit2, accentTetradic1, accentTetradic2, accentTetradic3, accentMonochromatic, ...coolHues];
  
  const highlightHue = highlightOptions[Math.floor(Math.random() * highlightOptions.length)];
  const highlightSaturation = 0.25 + Math.random() * 0.25; // 0.25-0.50 range (reduced from 0.45-0.80)
  
  // Ensure accent is darker than highlight when using monochromatic
  let highlightLightness: number;
  if (highlightHue === accentHue) {
    // Monochromatic: make highlight lighter than accent
    const accentLightnessValue = isLightMode 
      ? 0.35 + Math.random() * 0.25 // 0.35-0.60 range
      : 0.45 + Math.random() * 0.25; // 0.45-0.70 range
    
    highlightLightness = isLightMode 
      ? accentLightnessValue + (0.10 + Math.random() * 0.15) // 0.10-0.25 lighter than accent (reduced range)
      : accentLightnessValue + (0.08 + Math.random() * 0.12); // 0.08-0.20 lighter than accent (reduced range)
    
    highlightLightness = Math.min(highlightLightness, 0.85); // Cap at 0.85 (reduced from 0.95)
  } else {
    // Non-monochromatic: use tighter range
    highlightLightness = isLightMode 
      ? 0.55 + Math.random() * 0.20 // 0.55-0.75 range (reduced from 0.50-0.75)
      : 0.35 + Math.random() * 0.20; // 0.35-0.55 range (reduced from 0.30-0.55)
  }
  
  const highlight = chroma.hsl(highlightHue, highlightSaturation, highlightLightness).hex();

  // Card with more variation
  const bgHSL = chroma(background).hsl();
  let cardL = isLightMode ? bgHSL[2] - (0.10 + Math.random() * 0.15) : bgHSL[2] + (0.10 + Math.random() * 0.15);
  cardL = Math.max(0, Math.min(1, cardL)); // clamp to [0,1]
  const cardSaturation = bgHSL[1] * (0.8 + Math.random() * 0.4); // Vary saturation too
  const card = chroma.hsl(bgHSL[0], cardSaturation, cardL).hex();

  return { background, foreground, accent, highlight, card };
}

// Apply theme to CSS custom properties
export function applyThemeToSite(theme: Theme): void {
  const root = document.documentElement;
  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-foreground', theme.foreground);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-highlight', theme.highlight);
  root.style.setProperty('--color-card', theme.card);
}

// Save theme to localStorage
export function saveTheme(theme: Theme): void {
  localStorage.setItem('site-theme', JSON.stringify(theme));
}

// Load theme from localStorage
export function loadTheme(): Theme | null {
  const saved = localStorage.getItem('site-theme');
  return saved ? JSON.parse(saved) : null;
}

// Save theme to user's theme collection
export function saveToThemeCollection(theme: Theme, name?: string): void {
  const savedThemes = getThemeCollection();
  const themeName = name || `Theme ${savedThemes.length + 1}`;
  const themeWithMeta = {
    ...theme,
    id: Date.now().toString(),
    name: themeName,
    createdAt: new Date().toISOString()
  };
  
  savedThemes.push(themeWithMeta);
  localStorage.setItem('theme-collection', JSON.stringify(savedThemes));
}

// Get user's saved theme collection
export function getThemeCollection(): Array<Theme & { id: string; name: string; createdAt: string }> {
  const saved = localStorage.getItem('theme-collection');
  return saved ? JSON.parse(saved) : [];
}

// Remove theme from collection
export function removeFromThemeCollection(themeId: string): void {
  const savedThemes = getThemeCollection();
  const filteredThemes = savedThemes.filter(theme => theme.id !== themeId);
  localStorage.setItem('theme-collection', JSON.stringify(filteredThemes));
}

// Check if current theme is already saved
export function isThemeSaved(theme: Theme): boolean {
  const savedThemes = getThemeCollection();
  return savedThemes.some(savedTheme => 
    savedTheme.background === theme.background &&
    savedTheme.foreground === theme.foreground &&
    savedTheme.accent === theme.accent &&
    savedTheme.highlight === theme.highlight &&
    savedTheme.card === theme.card
  );
}

// Initialize theme (load saved or generate new)
export function initializeTheme(): Theme {
  const savedTheme = loadTheme();
  const theme = savedTheme || generateTheme();
  applyThemeToSite(theme);
  return theme;
} 