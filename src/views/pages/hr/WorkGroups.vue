<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Work Groups Management</h5>
                <p>Manage and organize work groups within your organization.</p>

                <DataTable :value="paginatedWorkGroups" responsiveLayout="scroll">
                    <Column field="id" header="ID" :sortable="true"></Column>
                    <Column field="name" header="Group Name" :sortable="true"></Column>
                    <Column field="department" header="Department" :sortable="true"></Column>
                    <Column field="members" header="Members" :sortable="true"></Column>
                    <Column field="lead" header="Team Lead" :sortable="true"></Column>
                    <Column header="Actions">
                        <template #body>
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" severity="success" outlined="" />
                            <Button icon="pi pi-trash" class="p-button-rounded" severity="danger" outlined="" />
                        </template>
                    </Column>
                </DataTable>

                <CustomPaginator :current-page="currentPage" :total-items="workGroups.length" :items-per-page="itemsPerPage" @page-change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const currentPage = ref(1);
const itemsPerPage = ref(10);

const workGroups = ref([
    {
        id: 1,
        name: 'Engineering Team A',
        department: 'Engineering',
        members: 12,
        lead: 'John Smith'
    },
    {
        id: 2,
        name: 'Design Team',
        department: 'Design',
        members: 8,
        lead: 'Sarah Johnson'
    },
    {
        id: 3,
        name: 'QA Team',
        department: 'Quality Assurance',
        members: 6,
        lead: 'Mike Wilson'
    },
    {
        id: 4,
        name: 'DevOps Team',
        department: 'Operations',
        members: 5,
        lead: 'Emily Brown'
    },
    {
        id: 5,
        name: 'Product Team',
        department: 'Product Management',
        members: 7,
        lead: 'David Lee'
    },
    {
        id: 6,
        name: 'Frontend Team',
        department: 'Engineering',
        members: 9,
        lead: 'Lisa Chen'
    },
    {
        id: 7,
        name: 'Backend Team',
        department: 'Engineering',
        members: 11,
        lead: 'Robert Taylor'
    },
    {
        id: 8,
        name: 'UX Research Team',
        department: 'Design',
        members: 4,
        lead: 'Maria Rodriguez'
    },
    {
        id: 9,
        name: 'Security Team',
        department: 'Operations',
        members: 3,
        lead: 'James Wilson'
    },
    {
        id: 10,
        name: 'Data Analytics Team',
        department: 'Analytics',
        members: 6,
        lead: 'Jennifer Davis'
    },
    {
        id: 11,
        name: 'Customer Support Team',
        department: 'Support',
        members: 15,
        lead: 'Michael Brown'
    },
    {
        id: 12,
        name: 'Sales Team',
        department: 'Sales',
        members: 8,
        lead: 'Amanda Johnson'
    }
]);

const paginatedWorkGroups = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return workGroups.value.slice(start, end);
});

const handlePageChange = (page) => {
    currentPage.value = page;
};
</script>

<style scoped>
.mr-2 {
    margin-right: 0.5rem;
}
</style>
