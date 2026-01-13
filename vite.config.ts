
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load variables from .env files
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  // Create a combined environment object that merges file-based and system-based variables.
  // This is crucial for platforms like Netlify where variables are in process.env but not in .env files.
  const API_KEY = env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Shim process.env.API_KEY exactly as required by the @google/genai library instructions.
      'process.env.API_KEY': JSON.stringify(API_KEY)
    }
  };
});
