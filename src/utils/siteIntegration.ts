// Site Integration Guide for Thematic Colors
// This file contains everything needed to integrate the color system into any website

// 1. Required Dependencies
// npm install chroma-js
// npm install --save-dev @types/chroma-js

// 2. CSS Variables Setup
// Add this to your global CSS:
// :root {
//   --color-background: #ffffff;
//   --color-foreground: #000000;
//   --color-accent: #3b82f6;
//   --color-highlight: #f59e0b;
//   --color-card: #f8fafc;
// }

// 3. React Integration Example
// import { GetColorfulButton } from './components/GetColorfulButton';
// 
// function YourWebsite() {
//   return (
//     <div>
//       <GetColorfulButton />
//     </div>
//   );
// }

// 4. Vanilla JavaScript Integration
// Add floating button to page
// function addGetColorfulButton() {
//   const button = document.createElement('button');
//   button.innerHTML = '🎨 Get Colorful';
//   button.className = 'get-colorful-btn';
//   // Add styles and event listeners
//   document.body.appendChild(button);
// }

// 5. WordPress Integration
// Add to your theme's functions.php
// function add_get_colorful_button() {
//   wp_enqueue_script('get-colorful', get_template_directory_uri() . '/js/get-colorful.js', array(), '1.0', true);
// }
// add_action('wp_enqueue_scripts', 'add_get_colorful_button');

// 6. Shopify Integration
// Add to your theme.liquid
// {{ 'get-colorful.css' | asset_url | stylesheet_tag }}
// {{ 'get-colorful.js' | asset_url | script_tag }}

// 7. Performance Tips
// - Load chroma-js only when popup is opened
// - Use CSS transitions for smooth color changes
// - Cache generated themes in localStorage
// - Lazy load the popup component

// 8. Accessibility Considerations
// - Ensure color contrast meets WCAG guidelines
// - Provide keyboard navigation for popup
// - Add ARIA labels for screen readers
// - Test with color blindness simulators

export const integrationGuide = {
  dependencies: ['chroma-js', '@types/chroma-js'],
  cssVariables: ['--color-background', '--color-foreground', '--color-accent', '--color-highlight', '--color-card'],
  components: ['ColorPopup', 'GetColorfulButton'],
  utilities: ['themeGenerator', 'themeExporter']
}; 