<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import {
    onBeforeRouteLeave,
    onBeforeRouteUpdate,
    useRoute,
    useRouter,
} from 'vue-router';

import { storeToRefs } from 'pinia';

import {
    getRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    getCountries,
} from './api';

import { useSettingsStore } from './stores/settings';

import Modal from './components/Modal.vue';
import Pagination from './components/Pagination.vue';
import ConfirmLeave from './components/ConfirmLeave.vue';

const route = useRoute();
const router = useRouter();

const settings = useSettingsStore();

const { theme, language, perPage, searchQ, filterCountry, sortDir } =
    storeToRefs(settings);

const routes = ref([]);
const countries = ref([]);
const loading = ref(true);

const page = ref(1);

const formOpen = ref(false);

const dirty = ref(false);
const initialFormState = ref('');
const discardModalOpen = ref(false);

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

const selectedIds = ref(new Set());

const bulkDeleteModalOpen = ref(false);

const editingId = computed(() => route.params.id ?? null);

const text = computed(() => {
    if (language.value === 'ua') {
        return {
            addRoute: 'Додати маршрут',
            theme: 'Змінити тему',
            language: 'Змінити мову',

            kicker: 'Щоденник подорожей / Vue 3',
            description: 'Колекція маршрутів для допитливих мандрівників.',

            search: 'Пошук маршрутів...',
            allCountries: 'Усі країни',
            duration: 'Тривалість',

            selectPage: 'Вибрати сторінку',
            deleteSelected: 'Видалити вибрані',

            bulkDeleteTitle: 'Видалити вибрані маршрути?',
            bulkDeleteText: 'Буде видалено маршрутів',
            bulkDeleteWarning: 'Цю дію неможливо скасувати.',

            loading: 'Завантаження маршрутів...',
            empty: 'Маршрутів не знайдено.',

            days: 'днів',
            day: 'день',
            difficulty: 'Складність',

            edit: 'Редагувати',
            delete: 'Видалити',

            newRoute: 'Новий маршрут',
            editRoute: 'Редагування маршруту',

            newSubtitle: 'Додайте нове місце до щоденника.',
            editSubtitle: 'Оновіть інформацію про маршрут.',

            routeName: 'Назва маршруту',
            country: 'Країна',
            selectCountry: 'Оберіть країну...',
            selectDifficulty: 'Оберіть...',

            easy: 'Легко',
            medium: 'Середньо',
            hard: 'Складно',

            cancel: 'Скасувати',
            save: 'Зберегти',
            add: 'Додати маршрут',

            deleteTitle: 'Видалити маршрут?',
            deleteText: 'Ви збираєтесь видалити',
            deleteWarning: 'Цю дію неможливо скасувати.',

            discardTitle: 'Відхилити зміни?',
            discardText:
                'У формі є незбережені зміни. Якщо вийти зараз, введені дані буде втрачено.',

            leaveWarning: 'Є незбережені зміни. Вийти без збереження?',

            nameRequired: 'Вкажіть назву маршруту',
            countryRequired: 'Оберіть країну',
            durationRequired: 'Тривалість повинна бути більше 0',
            difficultyRequired: 'Оберіть складність',
        };
    }

    return {
        addRoute: 'Add route',
        theme: 'Change theme',
        language: 'Change language',

        kicker: 'Travel journal / Vue 3',
        description: 'A collection of routes for curious travelers.',

        search: 'Search routes...',
        allCountries: 'All countries',
        duration: 'Duration',

        selectPage: 'Select page',
        deleteSelected: 'Delete selected',

        bulkDeleteTitle: 'Delete selected routes?',
        bulkDeleteText: 'Routes to be deleted',
        bulkDeleteWarning: 'This action cannot be undone.',

        loading: 'Loading routes...',
        empty: 'No routes found.',

        days: 'days',
        day: 'day',
        difficulty: 'Difficulty',

        edit: 'Edit',
        delete: 'Delete',

        newRoute: 'New route',
        editRoute: 'Edit route',

        newSubtitle: 'Add another place to the journal.',
        editSubtitle: 'Update your travel note.',

        routeName: 'Route name',
        country: 'Country',
        selectCountry: 'Select country...',
        selectDifficulty: 'Select...',

        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',

        cancel: 'Cancel',
        save: 'Save',
        add: 'Add route',

        deleteTitle: 'Delete route?',
        deleteText: 'You are about to delete',
        deleteWarning: 'This action cannot be undone.',

        discardTitle: 'Discard changes?',
        discardText:
            'The form contains unsaved changes. If you leave now, the entered data will be lost.',

        leaveWarning: 'There are unsaved changes. Leave without saving?',

        nameRequired: 'Route name is required',
        countryRequired: 'Country is required',
        durationRequired: 'Duration must be greater than 0',
        difficultyRequired: 'Difficulty is required',
    };
});

const difficultyLabel = (value) => {
    if (value === 'Easy') {
        return text.value.easy;
    }

    if (value === 'Medium') {
        return text.value.medium;
    }

    if (value === 'Hard') {
        return text.value.hard;
    }

    return value;
};

const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const toggleLanguage = () => {
    language.value = language.value === 'en' ? 'ua' : 'en';
};

watch(
    theme,
    (value) => {
        document.documentElement.dataset.theme = value;
    },
    {
        immediate: true,
    },
);

watch(
    language,
    (value) => {
        document.documentElement.lang = value === 'ua' ? 'uk' : 'en';
    },
    {
        immediate: true,
    },
);

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

const getFormState = () => {
    return JSON.stringify({
        name: form.name,
        countryId: form.countryId,
        duration: form.duration,
        difficulty: form.difficulty,
    });
};

const rememberFormState = () => {
    initialFormState.value = getFormState();

    dirty.value = false;
};

watch(
    form,
    () => {
        if (!formOpen.value) {
            return;
        }

        dirty.value = getFormState() !== initialFormState.value;
    },
    {
        deep: true,
    },
);

const validate = () => {
    errors.name = '';
    errors.countryId = '';
    errors.duration = '';
    errors.difficulty = '';

    let valid = true;

    if (!form.name.trim()) {
        errors.name = text.value.nameRequired;

        valid = false;
    }

    if (!form.countryId) {
        errors.countryId = text.value.countryRequired;

        valid = false;
    }

    if (!form.duration || Number(form.duration) <= 0) {
        errors.duration = text.value.durationRequired;

        valid = false;
    }

    if (!form.difficulty) {
        errors.difficulty = text.value.difficultyRequired;

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

        rememberFormState();
    } catch {
        router.replace('/routes');
    }
};

const openCreateModal = () => {
    resetForm();

    formOpen.value = true;

    rememberFormState();
};

const finishCloseForm = async () => {
    dirty.value = false;

    discardModalOpen.value = false;

    formOpen.value = false;

    resetForm();

    if (editingId.value) {
        await router.push('/routes');
    }
};

const closeFormModal = async () => {
    if (dirty.value) {
        discardModalOpen.value = true;

        return;
    }

    await finishCloseForm();
};

const cancelDiscard = () => {
    discardModalOpen.value = false;
};

const confirmDiscard = async () => {
    await finishCloseForm();
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

        dirty.value = false;

        await router.push('/routes');
    } else {
        await createRoute(payload);

        dirty.value = false;
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

    const deletedId = String(routeToDelete.value.id);

    await deleteRoute(routeToDelete.value.id);

    const next = new Set(selectedIds.value);

    next.delete(deletedId);

    selectedIds.value = next;

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

const pageIds = computed(() => {
    return pagedRoutes.value.map((item) => String(item.id));
});

const allPageSelected = computed(() => {
    return (
        pageIds.value.length > 0 &&
        pageIds.value.every((id) => selectedIds.value.has(id))
    );
});

const toggleSelected = (id, checked) => {
    const next = new Set(selectedIds.value);

    const normalizedId = String(id);

    if (checked) {
        next.add(normalizedId);
    } else {
        next.delete(normalizedId);
    }

    selectedIds.value = next;
};

const toggleAllPage = (checked) => {
    const next = new Set(selectedIds.value);

    for (const id of pageIds.value) {
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
    }

    selectedIds.value = next;
};

const openBulkDeleteModal = () => {
    if (selectedIds.value.size === 0) {
        return;
    }

    bulkDeleteModalOpen.value = true;
};

const closeBulkDeleteModal = () => {
    bulkDeleteModalOpen.value = false;
};

const confirmBulkDelete = async () => {
    const ids = [...selectedIds.value];

    if (ids.length === 0) {
        return;
    }

    await Promise.all(ids.map((id) => deleteRoute(id)));

    selectedIds.value = new Set();

    closeBulkDeleteModal();

    await loadData();
};

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

            dirty.value = false;

            resetForm();
        }
    },
);

const confirmRouteLeave = () => {
    if (!dirty.value) {
        return true;
    }

    return window.confirm(text.value.leaveWarning);
};

onBeforeRouteLeave(() => {
    return confirmRouteLeave();
});

onBeforeRouteUpdate(() => {
    return confirmRouteLeave();
});

onMounted(async () => {
    settings.loadFromStorage();

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
                    :data-tooltip="text.addRoute"
                    :aria-label="text.addRoute"
                    @click="openCreateModal"
                >
                    +
                </button>

                <button
                    type="button"
                    class="sidebar-icon-button sidebar-theme"
                    :data-tooltip="text.theme"
                    :aria-label="text.theme"
                    @click="toggleTheme"
                >
                    {{ theme === 'light' ? '◐' : '○' }}
                </button>

                <button
                    type="button"
                    class="sidebar-icon-button"
                    :data-tooltip="text.language"
                    :aria-label="text.language"
                    @click="toggleLanguage"
                >
                    {{ language === 'en' ? 'UA' : 'EN' }}
                </button>
            </div>

            <div class="sidebar-mini-mark">A</div>
        </aside>

        <main class="atlas">
            <section class="atlas-intro">
                <p class="atlas-kicker">
                    {{ text.kicker }}
                </p>

                <h1 class="atlas-title">ATLAS.</h1>

                <p class="atlas-description">
                    {{ text.description }}
                </p>
            </section>

            <section class="atlas-controls">
                <div class="search-box">
                    <input
                        v-model="searchQ"
                        type="text"
                        :placeholder="text.search"
                    />
                </div>

                <select v-model="filterCountry">
                    <option value="">
                        {{ text.allCountries }}
                    </option>

                    <option
                        v-for="country in countries"
                        :key="country.id"
                        :value="country.id"
                    >
                        {{ country.name }}
                    </option>
                </select>

                <button type="button" class="sort-button" @click="toggleSort">
                    {{ text.duration }}

                    {{ sortDir === 'asc' ? '↑' : '↓' }}
                </button>
            </section>

            <div class="bulk-actions">
                <label class="select-page">
                    <input
                        type="checkbox"
                        :checked="allPageSelected"
                        @change="toggleAllPage($event.target.checked)"
                    />

                    <span>
                        {{ text.selectPage }}
                    </span>
                </label>

                <button
                    type="button"
                    class="bulk-delete"
                    :disabled="selectedIds.size === 0"
                    @click="openBulkDeleteModal"
                >
                    {{ text.deleteSelected }}
                    ({{ selectedIds.size }})
                </button>
            </div>

            <p v-if="loading" class="loading">
                {{ text.loading }}
            </p>

            <section v-else class="routes-grid">
                <article
                    v-for="(item, index) in pagedRoutes"
                    :key="item.id"
                    :class="[
                        'route-card',
                        {
                            'route-card-selected': selectedIds.has(
                                String(item.id),
                            ),
                        },
                    ]"
                >
                    <label class="route-checkbox">
                        <input
                            type="checkbox"
                            :checked="selectedIds.has(String(item.id))"
                            @change="
                                toggleSelected(item.id, $event.target.checked)
                            "
                        />

                        <span></span>
                    </label>

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
                            <span>
                                {{ text.duration }}
                            </span>

                            <strong>
                                {{ item.duration }}

                                {{
                                    Number(item.duration) === 1
                                        ? text.day
                                        : text.days
                                }}
                            </strong>
                        </div>

                        <div>
                            <span>
                                {{ text.difficulty }}
                            </span>

                            <strong
                                class="difficulty"
                                :class="`difficulty-${item.difficulty.toLowerCase()}`"
                            >
                                {{ difficultyLabel(item.difficulty) }}
                            </strong>
                        </div>
                    </div>

                    <div class="route-actions">
                        <button type="button" @click="editRoute(item.id)">
                            {{ text.edit }}
                        </button>

                        <button type="button" @click="askDelete(item)">
                            {{ text.delete }}
                        </button>
                    </div>
                </article>
            </section>

            <p v-if="!loading && pagedRoutes.length === 0" class="empty-state">
                {{ text.empty }}
            </p>

            <Pagination
                :page="page"
                :total-pages="totalPages"
                :per-page="perPage"
                @page="changePage"
                @per-page="changePerPage"
            />
        </main>

        <ConfirmLeave :enabled="dirty && formOpen" />

        <div v-if="formOpen" class="modal-backdrop" @click="closeFormModal">
            <div class="route-editor-modal" @click.stop>
                <div class="route-editor-top">
                    <div>
                        <div class="modal-mark">
                            ATLAS /

                            {{ editingId ? 'EDIT' : 'NEW' }}
                        </div>

                        <h3>
                            {{ editingId ? text.editRoute : text.newRoute }}
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
                    {{ editingId ? text.editSubtitle : text.newSubtitle }}
                </p>

                <form class="route-editor-form" @submit.prevent="onSubmit">
                    <div class="field">
                        <label>
                            {{ text.routeName }}
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            placeholder="
                                Fjord Echo Trail
                            "
                        />

                        <span v-if="errors.name" class="error">
                            {{ errors.name }}
                        </span>
                    </div>

                    <div class="field">
                        <label>
                            {{ text.country }}
                        </label>

                        <select v-model="form.countryId">
                            <option value="">
                                {{ text.selectCountry }}
                            </option>

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
                            <label>
                                {{ text.duration }}
                            </label>

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
                            <label>
                                {{ text.difficulty }}
                            </label>

                            <select v-model="form.difficulty">
                                <option value="">
                                    {{ text.selectDifficulty }}
                                </option>

                                <option value="Easy">
                                    {{ text.easy }}
                                </option>

                                <option value="Medium">
                                    {{ text.medium }}
                                </option>

                                <option value="Hard">
                                    {{ text.hard }}
                                </option>
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
                            {{ text.cancel }}
                        </button>

                        <button type="submit" class="save-button">
                            {{ editingId ? text.save : text.add }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <Modal
            :open="deleteModalOpen"
            :title="text.deleteTitle"
            @close="closeDeleteModal"
            @confirm="confirmDelete"
        >
            <template v-if="routeToDelete">
                {{ text.deleteText }}

                <strong>
                    {{ routeToDelete.name }} </strong
                >.

                {{ text.deleteWarning }}
            </template>
        </Modal>

        <Modal
            :open="bulkDeleteModalOpen"
            :title="text.bulkDeleteTitle"
            @close="closeBulkDeleteModal"
            @confirm="confirmBulkDelete"
        >
            {{ text.bulkDeleteText }}:

            <strong>
                {{ selectedIds.size }} </strong
            >.

            {{ text.bulkDeleteWarning }}
        </Modal>

        <Modal
            :open="discardModalOpen"
            :title="text.discardTitle"
            @close="cancelDiscard"
            @confirm="confirmDiscard"
        >
            {{ text.discardText }}
        </Modal>
    </div>
</template>
