// Development Environment Configuration
export const config = {
    // API Configuration
    API_BASE_URL: 'https://localhost:7026/api',

    // Environment
    NODE_ENV: 'development',

    // Other development settings
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 1,

    // Feature flags
    ENABLE_LOGGING: true,
    ENABLE_DEBUG: true,

    // App settings
    APP_NAME: 'Sakai Vue (Dev)',
    APP_VERSION: '1.0.0-dev'
};

export default config;
