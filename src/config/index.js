// Environment Configuration Manager
// Switch between environments by commenting/uncommenting the import lines below

// === ENVIRONMENT SELECTION ===
// Uncomment ONE of the following lines to select your environment:

// Development Environment (localhost)
import { config } from '../../dev/config.js';

// Production Environment (published)
// import { config } from '../../env/config.js';

// === END ENVIRONMENT SELECTION ===

// Export the selected configuration
export default config;

// Named export for convenience
export const { API_BASE_URL, NODE_ENV, TIMEOUT, RETRY_ATTEMPTS, ENABLE_LOGGING, ENABLE_DEBUG, APP_NAME, APP_VERSION } = config;

// Helper functions
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';

// API URL builder helper
export const buildApiUrl = (endpoint) => {
    const baseUrl = config.API_BASE_URL.endsWith('/') ? config.API_BASE_URL.slice(0, -1) : config.API_BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
};

// Logging helper (only logs in development)
export const devLog = (...args) => {
    if (config.ENABLE_LOGGING) {
    }
};

// Debug helper
export const debugLog = (...args) => {
    if (config.ENABLE_DEBUG) {
    }
};
