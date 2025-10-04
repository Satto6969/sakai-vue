// Toast Injection Utility
import apiService from '@/service/ApiService.js';
import { useToast } from 'primevue/usetoast';

// Initialize toast service injection
export function initializeToastService() {
    const toast = useToast();
    apiService.setToastService(toast);
    return toast;
}

// Hook to ensure toast service is available
export function useToastInjection() {
    const toast = useToast();

    // Ensure API service has toast service
    if (!apiService.toastService) {
        apiService.setToastService(toast);
    }

    return toast;
}
