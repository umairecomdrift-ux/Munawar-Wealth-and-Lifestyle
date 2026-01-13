
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Use process.cwd() with type assertion to bypass the error where 'cwd' is not recognized on the 'Process' type.
  const root = (process as any).cwd ? (process as any).cwd() : '';
  const env = loadEnv(mode, root, '');
  
  return {
    plugins: [react()],
    define: {
      // Shim process.env.API_KEY for the client-side code as required by @google/genai guidelines.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY || '')
    }
  };
});
