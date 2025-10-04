import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Import PrimeVue components for global registration
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

// Import custom components for global registration
import CustomPaginator from '@/components/CustomPaginator.vue';

import '@/assets/styles.scss';

// Import API service to inject toast

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

// Register PrimeVue components globally
app.component('Button', Button);
app.component('Column', Column);
app.component('DataTable', DataTable);

// Register custom components globally
app.component('CustomPaginator', CustomPaginator);

// Mount the app
app.mount('#app');
