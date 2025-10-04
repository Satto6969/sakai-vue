// Authorization Store - Login and Signup functionality
import apiService from '@/service/ApiService.js';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null);
    const token = ref(localStorage.getItem('auth_token') || null);
    const accessiblePages = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const isInitialized = ref(false);

    // Getters (computed)
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const userRole = computed(() => user.value?.role || null);
    const userName = computed(() => user.value?.name || user.value?.username || 'User');
    const userEmail = computed(() => user.value?.email || null);
    const hasAccessToPage = computed(() => (pagePath) => {
        return accessiblePages.value.includes(pagePath);
    });

    // Actions
    const login = async (credentials) => {
        isLoading.value = true;
        error.value = null;

        // Call the login API endpoint with automatic toast
        const result = await apiService.apiPost('/Auth/login', {
            email: credentials.email,
            password: credentials.password
        });

        isLoading.value = false;

        if (result.success && result.data.data && result.data.data.token) {
            // Handle successful login - extract from nested data structure
            const responseData = result.data.data;

            token.value = responseData.token;
            user.value = {
                id: responseData.userId,
                name: responseData.user,
                email: credentials.email, // Use the email from login form
                role: responseData.role,
                roleID: responseData.roleID
            };

            // Store accessible pages
            accessiblePages.value = responseData.pages || [];

            // Store token and user data in localStorage for persistence
            localStorage.setItem('auth_token', responseData.token);
            localStorage.setItem('accessible_pages', JSON.stringify(accessiblePages.value));
            localStorage.setItem('user_data', JSON.stringify(user.value));

            // Set token for future API requests
            apiService.setAuthToken(responseData.token);

            console.log('Login successful:', {
                user: user.value,
                hasToken: !!token.value
            });

            return {
                success: true,
                user: user.value,
                token: token.value
            };
        } else {
            error.value = result.error || 'Login failed';
            return {
                success: false,
                error: error.value
            };
        }
    };

    const signup = async (userData) => {
        isLoading.value = true;
        error.value = null;

        // Call the signup API endpoint with automatic toast
        const result = await apiService.apiPost('/Auth/signup', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
            ...userData // Include any additional fields
        });

        isLoading.value = false;

        if (result.success) {
            if (result.data.token) {
                // Auto-login after successful signup
                token.value = result.data.token;
                user.value = result.data.user ||
                    result.data.data || {
                        name: userData.name,
                        email: userData.email
                    };

                // Store token in localStorage
                localStorage.setItem('auth_token', result.data.token);

                // Set token for future API requests
                apiService.setAuthToken(result.data.token);

                return {
                    success: true,
                    user: user.value,
                    token: token.value,
                    message: 'Account created successfully!'
                };
            } else {
                // Signup successful but no auto-login
                return {
                    success: true,
                    message: result.data.message || 'Account created successfully! Please login.',
                    requiresLogin: true
                };
            }
        } else {
            error.value = result.error || 'Signup failed';
            return {
                success: false,
                error: error.value
            };
        }
    };

    const logout = () => {
        // Clear state
        user.value = null;
        token.value = null;
        accessiblePages.value = [];
        error.value = null;

        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('accessible_pages');
        localStorage.removeItem('user_data');

        // Clear API service token
        apiService.setAuthToken(null);
    };

    const checkAuthStatus = async () => {
        if (!token.value) {
            return false;
        }

        try {
            // If we have a token but no user data, try to restore from localStorage
            if (!user.value) {
                console.log('⚠️ Token exists but no user data - restoring from localStorage');

                // Try to restore user data from localStorage if available
                const storedUser = localStorage.getItem('user_data');
                if (storedUser) {
                    try {
                        user.value = JSON.parse(storedUser);
                        console.log('✅ User data restored from localStorage');
                    } catch (e) {
                        console.warn('Failed to parse stored user data:', e);
                    }
                }

                // If still no user data, create minimal user object
                if (!user.value) {
                    user.value = {
                        id: 'unknown',
                        name: 'User',
                        email: 'unknown@example.com',
                        role: 'User'
                    };
                }
            }

            return true;
        } catch (err) {
            console.error('Auth status check failed:', err);
            logout();
            return false;
        }
    };

    const updateProfile = async (profileData) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await apiService.authenticatedRequest('/Auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });

            if (response.user) {
                user.value = { ...user.value, ...response.user };
                return {
                    success: true,
                    user: user.value
                };
            }

            return { success: true };
        } catch (err) {
            error.value = err.message || 'Profile update failed';
            return {
                success: false,
                error: error.value
            };
        } finally {
            isLoading.value = false;
        }
    };

    const changePassword = async (passwordData) => {
        isLoading.value = true;
        error.value = null;

        try {
            const response = await apiService.authenticatedRequest('/Auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword
                })
            });

            return {
                success: true,
                message: response.message || 'Password changed successfully'
            };
        } catch (err) {
            error.value = err.message || 'Password change failed';
            return {
                success: false,
                error: error.value
            };
        } finally {
            isLoading.value = false;
        }
    };

    const clearError = () => {
        error.value = null;
    };

    // Initialize auth state on store creation
    const initializeAuth = async () => {
        if (isInitialized.value) {
            return; // Already initialized
        }

        console.log('🔄 Initializing auth state...');

        if (token.value) {
            console.log('🔑 Token found in localStorage, validating...');

            // Restore accessible pages from localStorage
            const storedPages = localStorage.getItem('accessible_pages');
            if (storedPages) {
                try {
                    accessiblePages.value = JSON.parse(storedPages);
                } catch (e) {
                    console.warn('Failed to parse stored accessible pages:', e);
                    accessiblePages.value = [];
                }
            }

            // Restore user data from localStorage
            const storedUser = localStorage.getItem('user_data');
            if (storedUser) {
                try {
                    user.value = JSON.parse(storedUser);
                    console.log('✅ User data restored from localStorage');
                } catch (e) {
                    console.warn('Failed to parse stored user data:', e);
                }
            }

            // Set token for API requests
            apiService.setAuthToken(token.value);

            // Try to validate token with backend (optional - you can skip this if you trust localStorage)
            const isValid = await checkAuthStatus();
            if (!isValid) {
                console.log('❌ Token validation failed, clearing auth state');
                logout();
            } else {
                console.log('✅ Token validated successfully');
            }
        } else {
            console.log('🚫 No token found in localStorage');
        }

        isInitialized.value = true;
        console.log('✅ Auth initialization complete');
    };

    return {
        // State
        user,
        token,
        accessiblePages,
        isLoading,
        error,
        isInitialized,

        // Getters
        isAuthenticated,
        userRole,
        userName,
        userEmail,
        hasAccessToPage,

        // Actions
        login,
        signup,
        logout,
        checkAuthStatus,
        updateProfile,
        changePassword,
        clearError,
        initializeAuth
    };
});
