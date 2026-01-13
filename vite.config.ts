
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load variables from .env files for local dev
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  /**
   * CLOUDFLARE PAGES RESOLUTION:
   * Cloudflare provides environment variables during the build.
   * We map GEMINI_API_KEY to process.env.API_KEY for the app.
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
      // Shims the variable into the browser bundle
      'process.env.API_KEY': JSON.stringify(API_KEY),
      'process.env': JSON.stringify({ API_KEY: API_KEY })
    }
  };
});
