// Example usage of ApiService with environment configuration
import apiService from './ApiService.js';

// Example service class using the API service
export class UserService {
    // Get all users
    static async getUsers() {
        try {
            return await apiService.get('/users');
        } catch (error) {
            console.error('Failed to fetch users:', error);
            throw error;
        }
    }

    // Get user by ID
    static async getUserById(id) {
        try {
            return await apiService.get(`/users/${id}`);
        } catch (error) {
            console.error(`Failed to fetch user ${id}:`, error);
            throw error;
        }
    }

    // Create new user
    static async createUser(userData) {
        try {
            return await apiService.post('/users', userData);
        } catch (error) {
            console.error('Failed to create user:', error);
            throw error;
        }
    }

    // Update user
    static async updateUser(id, userData) {
        try {
            return await apiService.put(`/users/${id}`, userData);
        } catch (error) {
            console.error(`Failed to update user ${id}:`, error);
            throw error;
        }
    }

    // Delete user
    static async deleteUser(id) {
        try {
            return await apiService.delete(`/users/${id}`);
        } catch (error) {
            console.error(`Failed to delete user ${id}:`, error);
            throw error;
        }
    }

    // Login user
    static async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', credentials);

            // Set auth token for future requests
            if (response.token) {
                apiService.setAuthToken(response.token);
            }

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    // Get user profile (authenticated)
    static async getProfile() {
        try {
            return await apiService.authenticatedRequest('/auth/profile', {
                method: 'GET'
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            throw error;
        }
    }
}

// Example usage in a Vue component:
/*
<script setup>
import { ref, onMounted } from 'vue';
import { UserService } from '@/service/ExampleUsage.js';

const users = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        users.value = await UserService.getUsers();
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const createUser = async (userData) => {
    try {
        const newUser = await UserService.createUser(userData);
        users.value.push(newUser);
    } catch (err) {
        error.value = err.message;
    }
};

onMounted(() => {
    fetchUsers();
});
</script>
*/
