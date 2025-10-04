<template>
    <div class="custom-paginator flex flex-col gap-1">
  
        <div class="paginator-controls">
            <Button label="Prev" icon="pi pi-angle-left" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)" class="p-button-sm" severity="secondary" />

            <div class="page-numbers">
                <template v-for="page in visiblePages" :key="page">
                    <Button v-if="page !== '...'" :label="page.toString()" :class="{ 'p-button-sm': true, active: page === currentPage }" :severity="page === currentPage ? 'primary' : 'secondary'" @click="goToPage(page)" class="page-button" />
                    <span v-else class="ellipsis">...</span>
                </template>
            </div>

            <Button label="Next" icon="pi pi-angle-right" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)" class="p-button-sm" severity="secondary" />
        </div>
        <div class="paginator-info">
            <span class="total-items">{{ totalItems }} items total</span>
        </div>

    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    itemsPerPage: {
        type: Number,
        default: 10
    },
    maxVisiblePages: {
        type: Number,
        default: 5
    }
});

const emit = defineEmits(['page-change']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const visiblePages = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = props.currentPage;
    const maxVisible = props.maxVisiblePages;

    if (total <= maxVisible) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // Calculate start and end pages
        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);

        // Adjust start if we're near the end
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        // Add first page and ellipsis if needed
        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        // Add visible pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (end < total) {
            if (end < total - 1) {
                pages.push('...');
            }
            pages.push(total);
        }
    }

    return pages;
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
        emit('page-change', page);
    }
};
</script>

<style scoped>
.custom-paginator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
    gap: 1rem;
    
    margin-top: 1rem;
    border-top: 1px solid var(--surface-border);
}

.paginator-info {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.paginator-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.page-numbers {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.page-button {
    min-width: 2rem;
    height: 2rem;
    padding: 0;
}

.page-button.active {
    background-color: var(--primary-color);
    color: var(--primary-color-text);
}

.ellipsis {
    padding: 0 0.5rem;
    color: var(--text-color-secondary);
    font-weight: bold;
}

.total-items {
    font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .custom-paginator {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }

    .paginator-controls {
        justify-content: center;
    }

    .page-numbers {
        gap: 0.125rem;
    }

    .page-button {
        min-width: 1.75rem;
        height: 1.75rem;
        font-size: 0.875rem;
    }
}
</style>
