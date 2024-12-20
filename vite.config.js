import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // This allows connections from any IP address
    port: 5173,  // Make sure this matches the port you're using
  },
});
