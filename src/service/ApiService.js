// API Service using Environment Configuration
import config, { buildApiUrl, debugLog, devLog } from '@/config';

class ApiService {
    constructor() {
        this.baseURL = config.API_BASE_URL;
        this.timeout = config.TIMEOUT;
        this.retryAttempts = config.RETRY_ATTEMPTS;
        this.toastService = null; // Will be injected

        devLog('ApiService initialized with config:', {
            baseURL: this.baseURL,
            timeout: this.timeout,
            environment: config.NODE_ENV
        });
    }

    // Inject toast service (called from main.js or components)
    setToastService(toastService) {
        this.toastService = toastService;
        devLog('Toast service injected into ApiService');
    }

    // Show toast notification
    showToast(severity, summary, detail, life = 3000) {
        if (this.toastService) {
            this.toastService.add({
                severity,
                summary,
                detail,
                life
            });
        } else {
            // Fallback to console if toast service not available
        }
    }

    // Helper function to handle backend response with isDone flag and message
    handleBackendResponse(response, options, httpMethod = 'operation') {
        const { showSuccess = true, showError = true, fallbackSuccessMessage = `${httpMethod} completed successfully`, fallbackErrorMessage = `${httpMethod} failed` } = options;

        // Check if backend indicates success with isDone flag
        const isSuccess = response.isDone === true || response.isDone === undefined;
        const backendMessage = response.message || '';

        if (isSuccess) {
            if (showSuccess && backendMessage) {
                this.showToast('success', 'Success', backendMessage);
            } else if (showSuccess && !backendMessage) {
                this.showToast('success', 'Success', fallbackSuccessMessage);
            }
            return { success: true, data: response };
        } else {
            // Backend returned isDone: false, treat as error
            if (showError) {
                this.showToast('error', 'Error', backendMessage || fallbackErrorMessage, 5000);
            }
            return { success: false, error: backendMessage || fallbackErrorMessage };
        }
    }

    // Helper function to handle HTTP errors
    handleHttpError(error, options, httpMethod = 'operation') {
        const { showError = true, fallbackErrorMessage = `${httpMethod} failed` } = options;

        let errorMessage = fallbackErrorMessage;

        try {
            // Try to parse error response for backend message
            const errorData = JSON.parse(error.message);
            errorMessage = errorData.message || error.message;
        } catch {
            errorMessage = error.message;
        }

        if (showError) {
            this.showToast('error', 'Error', errorMessage, 5000);
        }

        return { success: false, error: errorMessage };
    }

    // Generic HTTP request method
    async request(endpoint, options = {}) {
        const url = buildApiUrl(endpoint);
        const defaultOptions = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        debugLog('Making request to:', url, 'with options:', defaultOptions);

        let lastError;

        // Retry logic
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    ...defaultOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                // Handle both success and expected error responses (like 401 with JSON body)
                const data = await response.json();

                if (!response.ok) {
                    // For 401/400 responses that contain JSON with isDone/message, return the data
                    // instead of throwing an error
                    if (response.status === 401 || response.status === 400) {
                        if (data && (data.isDone !== undefined || data.message)) {
                            devLog('Request returned expected error response:', { url, status: response.status, data });
                            return data; // Return the error response as normal data
                        }
                    }
                    // For other HTTP errors, throw as before
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                devLog('Request successful:', { url, status: response.status });
                return data;
            } catch (error) {
                lastError = error;
                devLog(`Request attempt ${attempt} failed:`, error.message);

                if (attempt === this.retryAttempts) {
                    break;
                }

                // Wait before retry (exponential backoff)
                await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }

        throw new Error(`Request failed after ${this.retryAttempts} attempts: ${lastError.message}`);
    }

    // HTTP Methods
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // File upload method
    async upload(endpoint, formData) {
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    }

    // Set authorization token
    setAuthToken(token) {
        this.authToken = token;
        devLog('Auth token set');
    }

    // Get request with auth token
    async authenticatedRequest(endpoint, options = {}) {
        if (!this.authToken) {
            throw new Error('No authentication token available');
        }

        return this.request(endpoint, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.authToken}`,
                ...options.headers
            }
        });
    }

    // ========================================
    // TOAST-ENABLED API METHODS
    // ========================================

    // POST with automatic toast notifications
    async apiPost(endpoint, data = {}, options = {}) {
        const { ...requestOptions } = options;

        try {
            const response = await this.post(endpoint, data, requestOptions);
            return this.handleBackendResponse(response, options, 'Create');
        } catch (error) {
            return this.handleHttpError(error, options, 'Create');
        }
    }

    // PUT with automatic toast notifications
    async apiPut(endpoint, data = {}, options = {}) {
        const { ...requestOptions } = options;

        try {
            const response = await this.put(endpoint, data, requestOptions);
            return this.handleBackendResponse(response, options, 'Update');
        } catch (error) {
            return this.handleHttpError(error, options, 'Update');
        }
    }

    // PATCH with automatic toast notifications
    async apiPatch(endpoint, data = {}, options = {}) {
        const { ...requestOptions } = options;

        try {
            const response = await this.patch(endpoint, data, requestOptions);
            return this.handleBackendResponse(response, options, 'Update');
        } catch (error) {
            return this.handleHttpError(error, options, 'Update');
        }
    }

    // DELETE with automatic toast notifications
    async apiDelete(endpoint, options = {}) {
        const { ...requestOptions } = options;

        try {
            const response = await this.delete(endpoint, requestOptions);
            return this.handleBackendResponse(response, options, 'Delete');
        } catch (error) {
            return this.handleHttpError(error, options, 'Delete');
        }
    }

    // GET with automatic error toast (success usually doesn't need toast for GET)
    async apiGet(endpoint, params = {}, options = {}) {
        const { showSuccess = false, ...requestOptions } = options;

        try {
            const response = await this.get(endpoint, params, requestOptions);
            return this.handleBackendResponse(response, { ...options, showSuccess }, 'Load data');
        } catch (error) {
            return this.handleHttpError(error, options, 'Load data');
        }
    }

    // Upload with automatic toast notifications
    async apiUpload(endpoint, formData, options = {}) {
        const { ...requestOptions } = options;

        try {
            const response = await this.upload(endpoint, formData, requestOptions);
            return this.handleBackendResponse(response, options, 'Upload');
        } catch (error) {
            return this.handleHttpError(error, options, 'Upload');
        }
    }

    // Authenticated request with automatic toast notifications
    async apiAuthenticatedRequest(endpoint, options = {}) {
        const { showSuccess = false, ...requestOptions } = options;

        try {
            const response = await this.authenticatedRequest(endpoint, requestOptions);
            return this.handleBackendResponse(response, { ...options, showSuccess }, 'Operation');
        } catch (error) {
            return this.handleHttpError(error, options, 'Operation');
        }
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Named exports for convenience
export const api = apiService;
export { ApiService };
