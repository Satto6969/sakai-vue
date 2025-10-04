<script setup>
import { useAuthStore } from '@/store/auth.js';
import { computed, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const authStore = useAuthStore();

// Define all possible menu items
const allMenuItems = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Human Resources',
        icon: 'pi pi-fw pi-users',
        items: [
            {
                label: 'Work Groups',
                icon: 'pi pi-fw pi-sitemap',
                to: '/hr/work-groups'
            }
        ]
    },
    {
        label: 'Marketing',
        icon: 'pi pi-fw pi-megaphone',
        items: [
            {
                label: 'Marketing Employees',
                icon: 'pi pi-fw pi-users',
                to: '/marketing/employees'
            }
        ]
    },
    {
        label: 'All Pages',
        icon: 'pi pi-fw pi-th-large',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/landing'
            },
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            {
                label: 'Auth Pages',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            {
                label: 'CRUD',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    }
]);

// Computed property to filter menu items based on accessible pages
const model = computed(() => {
    if (!authStore.isAuthenticated || !authStore.accessiblePages.length) {
        // If not authenticated or no accessible pages, show only Home and All Pages
        return allMenuItems.value.filter((item) => item.label === 'Home' || item.label === 'All Pages');
    }

    return allMenuItems.value
        .map((item) => {
            if (item.label === 'Home' || item.label === 'All Pages') {
                // Always show Home and All Pages
                return item;
            }

            // Filter items based on accessible pages
            const filteredItems = item.items?.filter((subItem) => {
                if (subItem.to) {
                    return authStore.hasAccessToPage(subItem.to);
                }
                if (subItem.items) {
                    // Handle nested items (like Auth Pages)
                    const filteredNestedItems = subItem.items.filter((nestedItem) => authStore.hasAccessToPage(nestedItem.to));
                    return filteredNestedItems.length > 0;
                }
                return false;
            });

            // Only include the category if it has accessible items
            if (filteredItems && filteredItems.length > 0) {
                return {
                    ...item,
                    items: filteredItems
                };
            }

            return null;
        })
        .filter((item) => item !== null);
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
