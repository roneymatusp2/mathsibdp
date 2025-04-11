import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simplest possible configuration
export default defineConfig({
  plugins: [react()],
  base: './'
});
