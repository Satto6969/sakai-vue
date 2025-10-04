import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // Environment variables configuration
    define: {
        // Make environment info available at build time
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
        __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
    },
    // Development server configuration
    server: {
        port: 5173,
        host: true
        // Proxy API requests to backend during development (optional)
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //         secure: false
        //     }
        // }
    },
    // Build configuration
    build: {
        // Generate source maps for debugging
        sourcemap: true,
        // Optimize chunks
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'vue-router'],
                    primevue: ['primevue/config', 'primeicons/primeicons.css']
                }
            }
        }
    }
});
