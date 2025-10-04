<!-- Example Vue Component using Auth Store -->
<template>
    <div class="auth-example">
        <!-- Login Form -->
        <div v-if="!authStore.isAuthenticated" class="auth-forms">
            <div class="login-form">
                <h3>Login</h3>
                <form @submit.prevent="handleLogin">
                    <div class="field">
                        <label for="loginEmail">Email</label>
                        <InputText id="loginEmail" v-model="loginForm.email" type="email" required />
                    </div>
                    <div class="field">
                        <label for="loginPassword">Password</label>
                        <Password id="loginPassword" v-model="loginForm.password" :feedback="false" toggleMask required />
                    </div>
                    <Button type="submit" label="Login" :loading="authStore.isLoading" class="w-full" />
                </form>
            </div>

            <div class="signup-form">
                <h3>Sign Up</h3>
                <form @submit.prevent="handleSignup">
                    <div class="field">
                        <label for="signupName">Name</label>
                        <InputText id="signupName" v-model="signupForm.name" required />
                    </div>
                    <div class="field">
                        <label for="signupEmail">Email</label>
                        <InputText id="signupEmail" v-model="signupForm.email" type="email" required />
                    </div>
                    <div class="field">
                        <label for="signupPassword">Password</label>
                        <Password id="signupPassword" v-model="signupForm.password" toggleMask required />
                    </div>
                    <div class="field">
                        <label for="confirmPassword">Confirm Password</label>
                        <Password id="confirmPassword" v-model="signupForm.confirmPassword" :feedback="false" toggleMask required />
                    </div>
                    <Button type="submit" label="Sign Up" :loading="authStore.isLoading" class="w-full" />
                </form>
            </div>
        </div>

        <!-- User Dashboard (when authenticated) -->
        <div v-else class="user-dashboard">
            <h3>Welcome, {{ authStore.userName }}!</h3>
            <p>Email: {{ authStore.userEmail }}</p>
            <p>Role: {{ authStore.userRole || 'User' }}</p>

            <Button label="Logout" @click="handleLogout" severity="secondary" />
        </div>

        <!-- Error Display -->
        <Message v-if="authStore.error" severity="error" :closable="true" @close="authStore.clearError">
            {{ authStore.error }}
        </Message>

        <!-- Success Message -->
        <Message v-if="successMessage" severity="success" :closable="true" @close="successMessage = ''">
            {{ successMessage }}
        </Message>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// Store and services
const authStore = useAuthStore();
const toast = useToast();

// Form data
const loginForm = ref({
    email: '',
    password: ''
});

const signupForm = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const successMessage = ref('');

// Methods
const handleLogin = async () => {
    const result = await authStore.login(loginForm.value);

    if (result.success) {
        toast.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: `Welcome back, ${authStore.userName}!`,
            life: 3000
        });

        // Reset form
        loginForm.value = { email: '', password: '' };
    } else {
        toast.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: result.error,
            life: 5000
        });
    }
};

const handleSignup = async () => {
    // Validate password confirmation
    if (signupForm.value.password !== signupForm.value.confirmPassword) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Passwords do not match',
            life: 5000
        });
        return;
    }

    const result = await authStore.signup(signupForm.value);

    if (result.success) {
        if (result.requiresLogin) {
            successMessage.value = result.message;
            toast.add({
                severity: 'success',
                summary: 'Account Created',
                detail: 'Please login with your new account',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'success',
                summary: 'Account Created',
                detail: `Welcome, ${authStore.userName}!`,
                life: 3000
            });
        }

        // Reset form
        signupForm.value = { name: '', email: '', password: '', confirmPassword: '' };
    } else {
        toast.add({
            severity: 'error',
            summary: 'Signup Failed',
            detail: result.error,
            life: 5000
        });
    }
};

const handleLogout = () => {
    authStore.logout();
    toast.add({
        severity: 'info',
        summary: 'Logged Out',
        detail: 'You have been successfully logged out',
        life: 3000
    });
};

// Initialize auth state
onMounted(async () => {
    await authStore.initializeAuth();
});
</script>

<style scoped>
.auth-example {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.auth-forms {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.login-form,
.signup-form {
    padding: 1.5rem;
    border: 1px solid var(--surface-border);
    border-radius: var(--border-radius);
}

.field {
    margin-bottom: 1rem;
}

.field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.user-dashboard {
    text-align: center;
    padding: 2rem;
    border: 1px solid var(--surface-border);
    border-radius: var(--border-radius);
    background: var(--surface-ground);
}

@media (max-width: 768px) {
    .auth-forms {
        grid-template-columns: 1fr;
    }
}
</style>
