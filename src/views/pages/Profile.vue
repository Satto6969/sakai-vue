<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Edit Profile</h5>
                <p class="text-surface-600 dark:text-surface-400 mb-4">Update your personal information</p>

                <form @submit.prevent="handleSubmit" class="p-fluid">
                    <div class="grid">
                        <!-- Name Field -->
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="name" class="font-semibold">Name</label>
                                <InputText id="name" v-model="formData.name" placeholder="Enter your name" />
                            </div>
                        </div>

                        <!-- Email Field (Read Only) -->
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="email" class="font-semibold">Email</label>
                                <InputText id="email" v-model="formData.email" disabled />
                                <small class="text-surface-500">Email cannot be changed</small>
                            </div>
                        </div>

                        <!-- Role Field (Read Only) -->
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="role" class="font-semibold">Role</label>
                                <InputText id="role" v-model="formData.role" disabled />
                            </div>
                        </div>

                        <!-- User ID (Hidden, for reference) -->
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="userId" class="font-semibold">User ID</label>
                                <InputText id="userId" v-model="formData.userId" disabled />
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="col-12">
                            <div class="flex gap-2">
                                <Button type="submit" label="Save Changes" icon="pi pi-check" :loading="isLoading" />
                                <Button type="button" label="Cancel" severity="secondary" icon="pi pi-times" @click="handleCancel" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Change Password Section -->
        <div class="col-12">
            <div class="card">
                <h5>Change Password</h5>
                <p class="text-surface-600 dark:text-surface-400 mb-4">Update your password</p>

                <form @submit.prevent="handlePasswordChange" class="p-fluid">
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="currentPassword" class="font-semibold">Current Password</label>
                                <Password id="currentPassword" v-model="passwordData.currentPassword" toggleMask :feedback="false" />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="newPassword" class="font-semibold">New Password</label>
                                <Password id="newPassword" v-model="passwordData.newPassword" toggleMask />
                            </div>
                        </div>

                        <div class="col-12 md:col-6">
                            <div class="field">
                                <label for="confirmPassword" class="font-semibold">Confirm New Password</label>
                                <Password id="confirmPassword" v-model="passwordData.confirmPassword" toggleMask :feedback="false" />
                            </div>
                        </div>

                        <div class="col-12">
                            <Button type="submit" label="Change Password" icon="pi pi-lock" :loading="isPasswordLoading" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(false);
const isPasswordLoading = ref(false);

const formData = ref({
    name: '',
    email: '',
    role: '',
    userId: ''
});

const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

// Load user data on mount
onMounted(() => {
    if (authStore.user) {
        formData.value = {
            name: authStore.user.name || '',
            email: authStore.user.email || '',
            role: authStore.user.role || '',
            userId: authStore.user.id || ''
        };
    }
});

const handleSubmit = async () => {
    isLoading.value = true;

    try {
        const result = await authStore.updateProfile({
            name: formData.value.name
        });

        if (result.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: result.error || 'Failed to update profile',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating profile',
            life: 3000
        });
    } finally {
        isLoading.value = false;
    }
};

const handlePasswordChange = async () => {
    if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'New password and confirmation do not match',
            life: 3000
        });
        return;
    }

    isPasswordLoading.value = true;

    try {
        const result = await authStore.changePassword({
            currentPassword: passwordData.value.currentPassword,
            newPassword: passwordData.value.newPassword,
            confirmPassword: passwordData.value.confirmPassword
        });

        if (result.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Password changed successfully',
                life: 3000
            });

            // Reset password fields
            passwordData.value = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: result.error || 'Failed to change password',
                life: 3000
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while changing password',
            life: 3000
        });
    } finally {
        isPasswordLoading.value = false;
    }
};

const handleCancel = () => {
    router.push({ name: 'dashboard' });
};
</script>
