
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This shims process.env.API_KEY to work in the browser.
    // It looks for API_KEY first, then falls back to your specific variable name.
    'process.env.API_KEY': JSON.stringify(
      process.env.API_KEY || 
      process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || 
      ''
    )
  }
});
