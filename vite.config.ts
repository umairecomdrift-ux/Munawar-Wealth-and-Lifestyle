
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load variables from .env files if they exist
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  /**
   * RESOLUTION LOGIC:
   * 1. Try GEMINI_API_KEY (Netlify recommended for secrets)
   * 2. Try VITE_GEMINI_API_KEY (Vite default)
   * 3. Fallback to raw API_KEY
   * We check both process.env (system) and env (file-based)
   */
  const API_KEY = 
    process.env.GEMINI_API_KEY || 
    env.GEMINI_API_KEY || 
    process.env.VITE_GEMINI_API_KEY || 
    env.VITE_GEMINI_API_KEY || 
    process.env.API_KEY ||
    env.API_KEY ||
    '';

  return {
    plugins: [react()],
    define: {
      // This shim ensures process.env.API_KEY is replaced with the actual string in your code.
      'process.env.API_KEY': JSON.stringify(API_KEY),
      // Also shim the parent object for broader compatibility
      'process.env': JSON.stringify({ API_KEY: API_KEY })
    }
  };
});
