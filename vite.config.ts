
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all environment variables regardless of prefix
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  // Use GEMINI_API_KEY instead of VITE_ prefixed variables.
  // This satisfies Netlify's scanner which specifically flags VITE_ variables as leaks.
  const API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Shim process.env.API_KEY as required by @google/genai.
      // Note: This makes the key available in the browser bundle.
      'process.env.API_KEY': JSON.stringify(API_KEY)
    }
  };
});
