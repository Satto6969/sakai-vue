<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Marketing Employees</h5>
                <p>View and manage marketing department employees.</p>

                <DataTable :value="paginatedEmployees" responsiveLayout="scroll">
                    <Column field="id" header="ID" :sortable="true"></Column>
                    <Column field="name" header="Name" :sortable="true"></Column>
                    <Column field="position" header="Position" :sortable="true"></Column>
                    <Column field="email" header="Email" :sortable="true"></Column>
                    <Column field="phone" header="Phone"></Column>
                    <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span :class="'badge status-' + slotProps.data.status.toLowerCase()">
                                {{ slotProps.data.status }}
                            </span>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body>
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" />
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" />
                        </template>
                    </Column>
                </DataTable>

                <CustomPaginator :current-page="currentPage" :total-items="employees.length" :items-per-page="itemsPerPage" @page-change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const currentPage = ref(1);
const itemsPerPage = ref(10);

const employees = ref([
    {
        id: 1,
        name: 'Alice Cooper',
        position: 'Marketing Manager',
        email: 'alice.cooper@company.com',
        phone: '+1 (555) 123-4567',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Bob Anderson',
        position: 'Content Strategist',
        email: 'bob.anderson@company.com',
        phone: '+1 (555) 234-5678',
        status: 'Active'
    },
    {
        id: 3,
        name: 'Carol White',
        position: 'Social Media Specialist',
        email: 'carol.white@company.com',
        phone: '+1 (555) 345-6789',
        status: 'Active'
    },
    {
        id: 4,
        name: 'Daniel Martinez',
        position: 'SEO Analyst',
        email: 'daniel.martinez@company.com',
        phone: '+1 (555) 456-7890',
        status: 'On Leave'
    },
    {
        id: 5,
        name: 'Emma Thompson',
        position: 'Brand Designer',
        email: 'emma.thompson@company.com',
        phone: '+1 (555) 567-8901',
        status: 'Active'
    },
    {
        id: 6,
        name: 'Frank Garcia',
        position: 'Marketing Coordinator',
        email: 'frank.garcia@company.com',
        phone: '+1 (555) 678-9012',
        status: 'Active'
    },
    {
        id: 7,
        name: 'Grace Lee',
        position: 'Digital Marketing Specialist',
        email: 'grace.lee@company.com',
        phone: '+1 (555) 789-0123',
        status: 'Active'
    },
    {
        id: 8,
        name: 'Henry Kim',
        position: 'Email Marketing Manager',
        email: 'henry.kim@company.com',
        phone: '+1 (555) 890-1234',
        status: 'Active'
    },
    {
        id: 9,
        name: 'Ivy Johnson',
        position: 'Marketing Analyst',
        email: 'ivy.johnson@company.com',
        phone: '+1 (555) 901-2345',
        status: 'Active'
    },
    {
        id: 10,
        name: 'Jack Wilson',
        position: 'Campaign Manager',
        email: 'jack.wilson@company.com',
        phone: '+1 (555) 012-3456',
        status: 'Active'
    },
    {
        id: 11,
        name: 'Kelly Brown',
        position: 'Marketing Assistant',
        email: 'kelly.brown@company.com',
        phone: '+1 (555) 123-4567',
        status: 'Active'
    },
    {
        id: 12,
        name: 'Liam Davis',
        position: 'Brand Manager',
        email: 'liam.davis@company.com',
        phone: '+1 (555) 234-5678',
        status: 'On Leave'
    },
    {
        id: 13,
        name: 'Maya Patel',
        position: 'Content Creator',
        email: 'maya.patel@company.com',
        phone: '+1 (555) 345-6789',
        status: 'Active'
    },
    {
        id: 14,
        name: 'Noah Taylor',
        position: 'Marketing Director',
        email: 'noah.taylor@company.com',
        phone: '+1 (555) 456-7890',
        status: 'Active'
    },
    {
        id: 15,
        name: 'Olivia Smith',
        position: 'PR Specialist',
        email: 'olivia.smith@company.com',
        phone: '+1 (555) 567-8901',
        status: 'Active'
    }
]);

const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return employees.value.slice(start, end);
});

const handlePageChange = (page) => {
    currentPage.value = page;
};
</script>

<style scoped>
.mr-2 {
    margin-right: 0.5rem;
}

.badge {
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-weight: 600;
    font-size: 0.875rem;
}

.status-active {
    background-color: #c8e6c9;
    color: #256029;
}

.status-on {
    background-color: #feedaf;
    color: #8a5340;
}
</style>
