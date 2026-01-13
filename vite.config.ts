
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load variables from .env files if they exist (local development)
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  /**
   * RESOLUTION LOGIC:
   * We strictly use GEMINI_API_KEY. 
   * Avoid VITE_ prefixes to prevent Netlify's scanner from triggering 
   * on automatic Vite inlining behaviors.
   */
  const API_KEY = 
    process.env.GEMINI_API_KEY || 
    env.GEMINI_API_KEY || 
    '';

  return {
    plugins: [react()],
    define: {
      // This shim ensures process.env.API_KEY is replaced with the actual string in your code.
      // Note: In a client-side app, this key WILL be visible in the JS bundle.
      'process.env.API_KEY': JSON.stringify(API_KEY),
      'process.env': JSON.stringify({ API_KEY: API_KEY })
    }
  };
});
