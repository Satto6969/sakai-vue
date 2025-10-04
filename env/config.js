// Production Environment Configuration
export const config = {
    // API Configuration
    API_BASE_URL: 'https://your-production-api.com/api',

    // Environment
    NODE_ENV: 'production',

    // Other production settings
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,

    // Feature flags
    ENABLE_LOGGING: false,
    ENABLE_DEBUG: false,

    // App settings
    APP_NAME: 'Sakai Vue',
    APP_VERSION: '1.0.0'
};

export default config;
