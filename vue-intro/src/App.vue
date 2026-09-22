<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
    getRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    getCountries,
} from './api';

import Modal from './components/Modal.vue';
import Pagination from './components/Pagination.vue';

const route = useRoute();
const router = useRouter();

const routes = ref([]);
const countries = ref([]);
const loading = ref(true);

const searchQ = ref('');
const filterCountry = ref('');
const sortDir = ref('asc');

const page = ref(1);
const perPage = ref(5);

const formOpen = ref(false);

const form = reactive({
    name: '',
    countryId: '',
    duration: '',
    difficulty: '',
});

const errors = reactive({
    name: '',
    countryId: '',
    duration: '',
    difficulty: '',
});

const deleteModalOpen = ref(false);
const routeToDelete = ref(null);

const editingId = computed(() => route.params.id ?? null);

const loadData = async () => {
    loading.value = true;

    try {
        const [routeList, countryList] = await Promise.all([
            getRoutes(),
            getCountries(),
        ]);

        routes.value = routeList;
        countries.value = countryList;
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    form.name = '';
    form.countryId = '';
    form.duration = '';
    form.difficulty = '';

    errors.name = '';
    errors.countryId = '';
    errors.duration = '';
    errors.difficulty = '';
};

const validate = () => {
    errors.name = '';
    errors.countryId = '';
    errors.duration = '';
    errors.difficulty = '';

    let valid = true;

    if (!form.name.trim()) {
        errors.name = 'Route name is required';
        valid = false;
    }

    if (!form.countryId) {
        errors.countryId = 'Country is required';
        valid = false;
    }

    if (!form.duration || Number(form.duration) <= 0) {
        errors.duration = 'Duration must be greater than 0';
        valid = false;
    }

    if (!form.difficulty) {
        errors.difficulty = 'Difficulty is required';
        valid = false;
    }

    return valid;
};

const loadEditRoute = async () => {
    if (!editingId.value) {
        return;
    }

    try {
        const currentRoute = await getRoute(editingId.value);

        form.name = currentRoute.name ?? '';
        form.countryId = currentRoute.countryId ?? '';
        form.duration = currentRoute.duration ?? '';
        form.difficulty = currentRoute.difficulty ?? '';

        errors.name = '';
        errors.countryId = '';
        errors.duration = '';
        errors.difficulty = '';

        formOpen.value = true;
    } catch {
        router.replace('/routes');
    }
};

const openCreateModal = () => {
    resetForm();
    formOpen.value = true;
};

const closeFormModal = async () => {
    formOpen.value = false;
    resetForm();

    if (editingId.value) {
        await router.push('/routes');
    }
};

const onSubmit = async () => {
    if (!validate()) {
        return;
    }

    const payload = {
        name: form.name.trim(),
        countryId: Number(form.countryId),
        duration: Number(form.duration),
        difficulty: form.difficulty,
    };

    if (editingId.value) {
        await updateRoute(editingId.value, payload);

        await router.push('/routes');
    } else {
        await createRoute(payload);
    }

    formOpen.value = false;
    resetForm();

    await loadData();
};

const editRoute = async (routeId) => {
    await router.push(`/routes/${routeId}/edit`);
};

const askDelete = (item) => {
    routeToDelete.value = item;
    deleteModalOpen.value = true;
};

const closeDeleteModal = () => {
    deleteModalOpen.value = false;
    routeToDelete.value = null;
};

const confirmDelete = async () => {
    if (!routeToDelete.value) {
        return;
    }

    await deleteRoute(routeToDelete.value.id);

    closeDeleteModal();

    await loadData();
};

const enrichedRoutes = computed(() => {
    return routes.value.map((item) => ({
        ...item,

        countryName:
            countries.value.find(
                (country) => Number(country.id) === Number(item.countryId),
            )?.name ?? 'Unknown',
    }));
});

const filteredRoutes = computed(() => {
    let result = enrichedRoutes.value;

    const search = searchQ.value.trim().toLowerCase();

    if (search) {
        result = result.filter((item) =>
            item.name.toLowerCase().includes(search),
        );
    }

    if (filterCountry.value) {
        result = result.filter(
            (item) => String(item.countryId) === String(filterCountry.value),
        );
    }

    return result;
});

const sortedRoutes = computed(() => {
    return [...filteredRoutes.value].sort((a, b) => {
        const first = Number(a.duration);
        const second = Number(b.duration);

        return sortDir.value === 'asc' ? first - second : second - first;
    });
});

const totalPages = computed(() => {
    return Math.max(1, Math.ceil(sortedRoutes.value.length / perPage.value));
});

const pagedRoutes = computed(() => {
    const start = (page.value - 1) * perPage.value;

    return sortedRoutes.value.slice(start, start + perPage.value);
});

const toggleSort = () => {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
};

const changePage = (value) => {
    page.value = value;
};

const changePerPage = (value) => {
    perPage.value = value;
    page.value = 1;
};

watch([searchQ, filterCountry, sortDir], () => {
    page.value = 1;
});

watch(totalPages, (value) => {
    if (page.value > value) {
        page.value = value;
    }
});

watch(
    () => route.params.id,
    () => {
        if (editingId.value) {
            loadEditRoute();
        } else {
            formOpen.value = false;
            resetForm();
        }
    },
);

onMounted(async () => {
    await loadData();

    if (editingId.value) {
        await loadEditRoute();
    }
});
</script>

<template>
    <div class="atlas-layout">
        <aside class="atlas-sidebar">
            <div class="sidebar-actions">
                <button
                    type="button"
                    class="sidebar-icon-button sidebar-add"
                    data-tooltip="Add route"
                    aria-label="Add route"
                    @click="openCreateModal"
                >
                    +
                </button>
            </div>

            <div class="sidebar-mini-mark">A</div>
        </aside>

        <main class="atlas">
            <section class="atlas-intro">
                <p class="atlas-kicker">Travel journal / Vue 3</p>

                <h1 class="atlas-title">ATLAS.</h1>

                <p class="atlas-description">
                    A collection of routes for curious travelers.
                </p>
            </section>

            <section class="atlas-controls">
                <div class="search-box">
                    <input
                        v-model="searchQ"
                        type="text"
                        placeholder="Search routes..."
                    />
                </div>

                <select v-model="filterCountry">
                    <option value="">All countries</option>

                    <option
                        v-for="country in countries"
                        :key="country.id"
                        :value="country.id"
                    >
                        {{ country.name }}
                    </option>
                </select>

                <button type="button" class="sort-button" @click="toggleSort">
                    Duration
                    {{ sortDir === 'asc' ? '↑' : '↓' }}
                </button>
            </section>

            <p v-if="loading" class="loading">Loading routes...</p>

            <section v-else class="routes-grid">
                <article
                    v-for="(item, index) in pagedRoutes"
                    :key="item.id"
                    class="route-card"
                >
                    <div class="route-number">
                        {{
                            String((page - 1) * perPage + index + 1).padStart(
                                2,
                                '0',
                            )
                        }}
                    </div>

                    <p class="route-country">
                        {{ item.countryName }}
                    </p>

                    <h2>
                        {{ item.name }}
                    </h2>

                    <div class="route-meta">
                        <div>
                            <span>Duration</span>

                            <strong>
                                {{ item.duration }}
                                {{
                                    Number(item.duration) === 1 ? 'day' : 'days'
                                }}
                            </strong>
                        </div>

                        <div>
                            <span>Difficulty</span>

                            <strong
                                class="difficulty"
                                :class="`difficulty-${item.difficulty.toLowerCase()}`"
                            >
                                {{ item.difficulty }}
                            </strong>
                        </div>
                    </div>

                    <div class="route-actions">
                        <button type="button" @click="editRoute(item.id)">
                            Edit
                        </button>

                        <button type="button" @click="askDelete(item)">
                            Delete
                        </button>
                    </div>
                </article>
            </section>

            <p v-if="!loading && pagedRoutes.length === 0" class="empty-state">
                No routes found.
            </p>

            <Pagination
                :page="page"
                :total-pages="totalPages"
                :per-page="perPage"
                @page="changePage"
                @per-page="changePerPage"
            />
        </main>

        <div v-if="formOpen" class="modal-backdrop" @click="closeFormModal">
            <div class="route-editor-modal" @click.stop>
                <div class="route-editor-top">
                    <div>
                        <div class="modal-mark">
                            ATLAS /
                            {{ editingId ? 'EDIT' : 'NEW' }}
                        </div>

                        <h3>
                            {{ editingId ? 'Edit route' : 'New route' }}
                        </h3>
                    </div>

                    <button
                        type="button"
                        class="editor-close"
                        @click="closeFormModal"
                    >
                        ×
                    </button>
                </div>

                <p class="route-editor-subtitle">
                    {{
                        editingId
                            ? 'Update your travel note.'
                            : 'Add another place to the journal.'
                    }}
                </p>

                <form class="route-editor-form" @submit.prevent="onSubmit">
                    <div class="field">
                        <label> Route name </label>

                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="Fjord Echo Trail"
                        />

                        <span v-if="errors.name" class="error">
                            {{ errors.name }}
                        </span>
                    </div>

                    <div class="field">
                        <label> Country </label>

                        <select v-model="form.countryId">
                            <option value="">Select country...</option>

                            <option
                                v-for="country in countries"
                                :key="country.id"
                                :value="country.id"
                            >
                                {{ country.name }}
                            </option>
                        </select>

                        <span v-if="errors.countryId" class="error">
                            {{ errors.countryId }}
                        </span>
                    </div>

                    <div class="route-editor-row">
                        <div class="field">
                            <label> Duration </label>

                            <input
                                v-model="form.duration"
                                type="number"
                                min="1"
                                placeholder="5"
                            />

                            <span v-if="errors.duration" class="error">
                                {{ errors.duration }}
                            </span>
                        </div>

                        <div class="field">
                            <label> Difficulty </label>

                            <select v-model="form.difficulty">
                                <option value="">Select...</option>

                                <option value="Easy">Easy</option>

                                <option value="Medium">Medium</option>

                                <option value="Hard">Hard</option>
                            </select>

                            <span v-if="errors.difficulty" class="error">
                                {{ errors.difficulty }}
                            </span>
                        </div>
                    </div>

                    <div class="route-editor-actions">
                        <button
                            type="button"
                            class="cancel-button"
                            @click="closeFormModal"
                        >
                            Cancel
                        </button>

                        <button type="submit" class="save-button">
                            {{ editingId ? 'Save' : 'Add route' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <Modal
            :open="deleteModalOpen"
            title="Delete route?"
            @close="closeDeleteModal"
            @confirm="confirmDelete"
        >
            <template v-if="routeToDelete">
                You are about to delete
                <strong>
                    {{ routeToDelete.name }} </strong
                >. This action cannot be undone.
            </template>
        </Modal>
    </div>
</template>
