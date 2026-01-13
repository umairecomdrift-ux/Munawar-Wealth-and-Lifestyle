
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Use '.' for loadEnv path to bypass 'cwd' property error on the Process type.
  const env = loadEnv(mode, '.', '');
  
  /**
   * CLOUDFLARE PAGES RESOLUTION:
   * Cloudflare provides environment variables during the build process.
   * Per guidelines, we use the name 'API_KEY' and assume it's pre-configured.
   */
  const API_KEY = process.env.API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Direct string replacement for process.env.API_KEY in the frontend code
      'process.env.API_KEY': JSON.stringify(API_KEY),
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
