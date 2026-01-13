
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load variables from .env files if they exist (for local development)
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  /**
   * VERCEL RESOLUTION LOGIC:
   * We look for GEMINI_API_KEY or API_KEY in the environment.
   * Vercel makes these available during the build step.
   */
  const API_KEY = 
    process.env.GEMINI_API_KEY || 
    env.GEMINI_API_KEY || 
    process.env.API_KEY ||
    env.API_KEY ||
    '';

  return {
    plugins: [react()],
    define: {
      // Injects the key into the client-side bundle.
      // Essential for @google/genai to function in the browser.
      'process.env.API_KEY': JSON.stringify(API_KEY),
      'process.env': JSON.stringify({ API_KEY: API_KEY })
    }
  };
});
