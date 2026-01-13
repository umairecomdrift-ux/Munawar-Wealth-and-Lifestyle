
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env vars regardless of the `VITE_` prefix.
  // Added (process as any) to bypass the TypeScript error where 'cwd' is missing on the global 'process' type.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This shims process.env.API_KEY for the browser.
      // We prioritize the user's preferred VITE_GEMINI_API_KEY variable.
      'process.env.API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY ||
        env.API_KEY || 
        env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || 
        process.env.API_KEY || 
        process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || 
        ''
      )
    }
  };
});
