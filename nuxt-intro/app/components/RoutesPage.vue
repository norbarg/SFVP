<script setup lang="ts">
import {
    computed,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue';

type TravelRoute = {
    id: string | number;
    name: string;
    countryId: string | number;
    duration: number;
    difficulty: string;
};

type Country = {
    id: string | number;
    name: string;
};

type RouteForm = {
    name: string;
    countryId: string;
    duration: string;
    difficulty: string;
};

type FormErrors = {
    name?: string;
    countryId?: string;
    duration?: string;
    difficulty?: string;
};

type DisplayRoute = TravelRoute & {
    countryName: string;
};

type Theme = 'light' | 'dark';

type Language = 'en' | 'ua';

const route = useRoute();

const router = useRouter();

const routes = ref<TravelRoute[]>([]);

const countries = ref<Country[]>([]);

const loading = ref(true);

const q = ref(String(route.query.q ?? ''));

const countryId = ref('');

const sortDir = ref<'asc' | 'desc'>('asc');

const page = ref(1);

const perPage = ref(5);

const formOpen = ref(false);

const formMode = ref<'create' | 'edit' | null>(null);

const editingId = ref<string | number | null>(null);

const confirmOpen = ref(false);

const toDelete = ref<TravelRoute | null>(null);

const selectedIds = ref<Set<string>>(new Set());

const bulkConfirmOpen = ref(false);

const leaveConfirmOpen = ref(false);

const dirty = ref(false);

const theme = ref<Theme>('light');

const language = ref<Language>('en');

const emptyForm = (): RouteForm => ({
    name: '',
    countryId: '',
    duration: '',
    difficulty: '',
});

const form = reactive<RouteForm>(emptyForm());

const initialForm = ref<RouteForm>(emptyForm());

const errors = reactive<FormErrors>({});

const translations = {
    en: {
        addRouteTooltip: 'Add route',

        darkMode: 'Dark mode',

        lightMode: 'Light mode',

        languageTooltip: 'Українська',

        kicker: 'Travel journal / 2026',

        description: 'A small collection of routes for curious travelers.',

        searchPlaceholder: 'Search routes...',

        find: 'Find',

        allCountries: 'All countries',

        duration: 'Duration',

        loading: 'Loading routes...',

        selectAll: 'Select all',

        deleteSelected: 'Delete selected',

        noRoutes: 'No routes found.',

        day: 'day',

        days: 'days',

        difficulty: 'Difficulty',

        edit: 'Edit',

        delete: 'Delete',

        newMark: 'NEW',

        editMark: 'EDIT',

        newRoute: 'New route',

        editRoute: 'Edit route',

        newSubtitle: 'Add another place to the journal.',

        editSubtitle: 'Update your travel note.',

        routeName: 'Route name',

        routePlaceholder: 'Fjord Echo Trail',

        country: 'Country',

        selectCountry: 'Select country...',

        select: 'Select...',

        easy: 'Easy',

        medium: 'Medium',

        hard: 'Hard',

        cancel: 'Cancel',

        save: 'Save',

        addRoute: 'Add route',

        deleteRouteTitle: 'Delete route?',

        deleteRouteTextStart: 'You are about to delete',

        cannotUndo: 'This action cannot be undone.',

        bulkDeleteTitle: 'Delete selected routes?',

        bulkDeleteStart: 'You are about to delete',

        selectedRoute: 'selected route',

        selectedRoutes: 'selected routes',

        discardTitle: 'Discard changes?',

        discardText:
            'You have unsaved changes. If you leave now, they will be lost.',

        discard: 'Discard',

        unknown: 'Unknown',

        validationName: 'Route name is required',

        validationCountry: 'Country is required',

        validationDuration: 'Duration must be greater than 0',

        validationDifficulty: 'Difficulty is required',
    },

    ua: {
        addRouteTooltip: 'Додати маршрут',

        darkMode: 'Темна тема',

        lightMode: 'Світла тема',

        languageTooltip: 'English',

        kicker: 'Щоденник подорожей / 2026',

        description: 'Невелика колекція маршрутів для допитливих мандрівників.',

        searchPlaceholder: 'Пошук маршрутів...',

        find: 'Знайти',

        allCountries: 'Усі країни',

        duration: 'Тривалість',

        loading: 'Завантаження маршрутів...',

        selectAll: 'Обрати всі',

        deleteSelected: 'Видалити обрані',

        noRoutes: 'Маршрутів не знайдено.',

        day: 'день',

        days: 'днів',

        difficulty: 'Складність',

        edit: 'Редагувати',

        delete: 'Видалити',

        newMark: 'НОВИЙ',

        editMark: 'РЕДАГУВАННЯ',

        newRoute: 'Новий маршрут',

        editRoute: 'Редагування маршруту',

        newSubtitle: 'Додайте новий маршрут до щоденника.',

        editSubtitle: 'Оновіть інформацію про маршрут.',

        routeName: 'Назва маршруту',

        routePlaceholder: 'Fjord Echo Trail',

        country: 'Країна',

        selectCountry: 'Оберіть країну...',

        select: 'Оберіть...',

        easy: 'Легка',

        medium: 'Середня',

        hard: 'Складна',

        cancel: 'Скасувати',

        save: 'Зберегти',

        addRoute: 'Додати маршрут',

        deleteRouteTitle: 'Видалити маршрут?',

        deleteRouteTextStart: 'Ви збираєтеся видалити',

        cannotUndo: 'Цю дію неможливо скасувати.',

        bulkDeleteTitle: 'Видалити обрані маршрути?',

        bulkDeleteStart: 'Ви збираєтеся видалити',

        selectedRoute: 'обраний маршрут',

        selectedRoutes: 'обраних маршрутів',

        discardTitle: 'Відхилити зміни?',

        discardText:
            'У вас є незбережені зміни. Якщо вийти зараз, вони будуть втрачені.',

        discard: 'Відхилити',

        unknown: 'Невідомо',

        validationName: 'Вкажіть назву маршруту',

        validationCountry: 'Оберіть країну',

        validationDuration: 'Тривалість повинна бути більшою за 0',

        validationDifficulty: 'Оберіть складність',
    },
};

const t = computed(() => translations[language.value]);

async function loadData() {
    loading.value = true;

    try {
        const [routeList, countryList] = await Promise.all([
            $fetch<TravelRoute[]>('/api/routes', {
                query: {
                    q: String(route.query.q ?? ''),
                },
            }),

            $fetch<Country[]>('/api/countries'),
        ]);

        routes.value = routeList;

        countries.value = countryList;
    } finally {
        loading.value = false;
    }
}

function clearErrors() {
    Object.keys(errors).forEach((key) => {
        delete errors[key as keyof FormErrors];
    });
}

function setForm(values: RouteForm) {
    form.name = values.name;

    form.countryId = values.countryId;

    form.duration = values.duration;

    form.difficulty = values.difficulty;
}

function validate(): boolean {
    clearErrors();

    if (!form.name.trim()) {
        errors.name = t.value.validationName;
    }

    if (!form.countryId) {
        errors.countryId = t.value.validationCountry;
    }

    if (!form.duration || Number(form.duration) < 1) {
        errors.duration = t.value.validationDuration;
    }

    if (!form.difficulty) {
        errors.difficulty = t.value.validationDifficulty;
    }

    return Object.keys(errors).length === 0;
}

function openCreate() {
    const clean = emptyForm();

    setForm(clean);

    initialForm.value = {
        ...clean,
    };

    clearErrors();

    editingId.value = null;

    formMode.value = 'create';

    formOpen.value = true;

    dirty.value = false;

    leaveConfirmOpen.value = false;
}

async function openEdit(id: string | number) {
    const item = routes.value.find(
        (current) => String(current.id) === String(id),
    );

    if (!item) {
        return;
    }

    const loaded: RouteForm = {
        name: item.name,

        countryId: String(item.countryId),

        duration: String(item.duration),

        difficulty: item.difficulty,
    };

    setForm(loaded);

    initialForm.value = {
        ...loaded,
    };

    editingId.value = item.id;

    formMode.value = 'edit';

    formOpen.value = true;

    dirty.value = false;

    leaveConfirmOpen.value = false;

    await router.push(
        `/routes/${item.id}/edit` +
            (route.query.q
                ? `?q=${encodeURIComponent(String(route.query.q))}`
                : ''),
    );
}

function hasFormChanged() {
    return (
        form.name !== initialForm.value.name ||
        form.countryId !== initialForm.value.countryId ||
        form.duration !== initialForm.value.duration ||
        form.difficulty !== initialForm.value.difficulty
    );
}

function closeForm() {
    if (dirty.value) {
        leaveConfirmOpen.value = true;

        return;
    }

    finishCloseForm();
}

function finishCloseForm() {
    formOpen.value = false;

    formMode.value = null;

    editingId.value = null;

    dirty.value = false;

    leaveConfirmOpen.value = false;

    clearErrors();

    setForm(emptyForm());

    if (route.params.id) {
        router.push(
            '/routes' +
                (route.query.q
                    ? `?q=${encodeURIComponent(String(route.query.q))}`
                    : ''),
        );
    }
}

async function saveForm() {
    if (!validate()) {
        return;
    }

    const payload = {
        name: form.name.trim(),

        countryId: Number(form.countryId),

        duration: Number(form.duration),

        difficulty: form.difficulty,
    };

    if (formMode.value === 'edit' && editingId.value !== null) {
        await $fetch(`/api/routes/${editingId.value}`, {
            method: 'PATCH',

            body: payload,
        });
    } else {
        await $fetch('/api/routes', {
            method: 'POST',

            body: payload,
        });
    }

    dirty.value = false;

    formOpen.value = false;

    formMode.value = null;

    editingId.value = null;

    setForm(emptyForm());

    if (route.params.id) {
        await router.push(
            '/routes' +
                (route.query.q
                    ? `?q=${encodeURIComponent(String(route.query.q))}`
                    : ''),
        );
    }

    await loadData();
}

function askDelete(item: TravelRoute) {
    toDelete.value = item;

    confirmOpen.value = true;
}

async function confirmDelete() {
    if (!toDelete.value) {
        return;
    }

    await $fetch(`/api/routes/${toDelete.value.id}`, {
        method: 'DELETE',
    });

    selectedIds.value.delete(String(toDelete.value.id));

    confirmOpen.value = false;

    toDelete.value = null;

    await loadData();
}

async function confirmBulkDelete() {
    const ids = [...selectedIds.value];

    for (const id of ids) {
        await $fetch(`/api/routes/${id}`, {
            method: 'DELETE',
        });
    }

    selectedIds.value = new Set();

    bulkConfirmOpen.value = false;

    await loadData();
}

function applySearch() {
    const value = q.value.trim();

    router.push({
        path: '/routes',

        query: value
            ? {
                  q: value,
              }
            : {},
    });

    page.value = 1;
}

function toggleSort() {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';

    page.value = 1;
}

const enrichedRoutes = computed<DisplayRoute[]>(() =>
    routes.value.map((item) => ({
        ...item,

        countryName:
            countries.value.find(
                (country) => String(country.id) === String(item.countryId),
            )?.name ?? t.value.unknown,
    })),
);

const filteredRoutes = computed(() => {
    let result = enrichedRoutes.value;

    if (countryId.value) {
        result = result.filter(
            (item) => String(item.countryId) === String(countryId.value),
        );
    }

    return result;
});

const sortedRoutes = computed(() =>
    [...filteredRoutes.value].sort((a, b) => {
        const first = Number(a.duration);

        const second = Number(b.duration);

        return sortDir.value === 'asc' ? first - second : second - first;
    }),
);

const total = computed(() => sortedRoutes.value.length);

const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / perPage.value)),
);

const pagedRoutes = computed(() => {
    const start = (page.value - 1) * perPage.value;

    return sortedRoutes.value.slice(start, start + perPage.value);
});

const pageIds = computed(() =>
    pagedRoutes.value.map((item) => String(item.id)),
);

const allPageSelected = computed(
    () =>
        pageIds.value.length > 0 &&
        pageIds.value.every((id) => selectedIds.value.has(id)),
);

function toggleSelected(
    id: string | number,

    checked: boolean,
) {
    const next = new Set(selectedIds.value);

    const key = String(id);

    if (checked) {
        next.add(key);
    } else {
        next.delete(key);
    }

    selectedIds.value = next;
}

function toggleSelectPage(checked: boolean) {
    const next = new Set(selectedIds.value);

    pageIds.value.forEach((id) => {
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
    });

    selectedIds.value = next;
}

function difficultyLabel(difficulty: string) {
    if (difficulty === 'Easy') {
        return t.value.easy;
    }

    if (difficulty === 'Medium') {
        return t.value.medium;
    }

    if (difficulty === 'Hard') {
        return t.value.hard;
    }

    return difficulty;
}

watch(
    () => route.query.q,

    async (value) => {
        q.value = String(value ?? '');

        await loadData();

        page.value = 1;
    },
);

watch(
    [countryId, sortDir, perPage],

    () => {
        page.value = 1;
    },
);

watch(totalPages, (pages) => {
    if (page.value > pages) {
        page.value = pages;
    }
});

watch(
    form,

    () => {
        if (!formOpen.value) {
            return;
        }

        dirty.value = hasFormChanged();
    },

    {
        deep: true,
    },
);

watch(theme, (value) => {
    if (import.meta.client) {
        document.documentElement.dataset.theme = value;

        localStorage.setItem('atlas-theme', value);
    }
});

watch(language, (value) => {
    if (import.meta.client) {
        document.documentElement.lang = value === 'ua' ? 'uk' : 'en';

        localStorage.setItem('atlas-language', value);
    }
});

function beforeUnload(event: BeforeUnloadEvent) {
    if (dirty.value && formOpen.value) {
        event.preventDefault();

        event.returnValue = '';
    }
}

onMounted(async () => {
    const savedTheme = localStorage.getItem('atlas-theme');

    const savedLanguage = localStorage.getItem('atlas-language');

    if (savedTheme === 'light' || savedTheme === 'dark') {
        theme.value = savedTheme;
    }

    if (savedLanguage === 'en' || savedLanguage === 'ua') {
        language.value = savedLanguage;
    }

    window.addEventListener('beforeunload', beforeUnload);

    await loadData();

    if (route.params.id) {
        await openEdit(String(route.params.id));
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnload);
});
</script>

<template>
    <div class="atlas-layout">
        <aside class="atlas-sidebar">
            <div class="sidebar-actions">
                <button
                    type="button"
                    class="sidebar-icon-button sidebar-add"
                    :data-tooltip="t.addRouteTooltip"
                    :aria-label="t.addRouteTooltip"
                    @click="openCreate"
                >
                    +
                </button>

                <button
                    type="button"
                    class="sidebar-icon-button sidebar-theme"
                    :data-tooltip="theme === 'light' ? t.darkMode : t.lightMode"
                    @click="theme = theme === 'light' ? 'dark' : 'light'"
                >
                    {{ theme === 'light' ? '◐' : '○' }}
                </button>

                <button
                    type="button"
                    class="sidebar-icon-button"
                    :data-tooltip="t.languageTooltip"
                    @click="language = language === 'en' ? 'ua' : 'en'"
                >
                    {{ language === 'en' ? 'UA' : 'EN' }}
                </button>
            </div>

            <div class="sidebar-mini-mark">A</div>
        </aside>

        <main class="atlas">
            <section class="atlas-intro">
                <p class="atlas-kicker">
                    {{ t.kicker }}
                </p>

                <h1 class="atlas-title">ATLAS.</h1>

                <p class="atlas-description">
                    {{ t.description }}
                </p>
            </section>

            <section class="atlas-controls">
                <div class="search-box">
                    <input
                        v-model="q"
                        type="text"
                        :placeholder="t.searchPlaceholder"
                        @keydown.enter="applySearch"
                    />

                    <button type="button" @click="applySearch">
                        {{ t.find }}
                    </button>
                </div>

                <select v-model="countryId">
                    <option value="">
                        {{ t.allCountries }}
                    </option>

                    <option
                        v-for="country in countries"
                        :key="country.id"
                        :value="String(country.id)"
                    >
                        {{ country.name }}
                    </option>
                </select>

                <button type="button" class="sort-button" @click="toggleSort">
                    {{ t.duration }}
                    {{ sortDir === 'asc' ? '↑' : '↓' }}
                </button>
            </section>

            <p v-if="loading" class="loading">
                {{ t.loading }}
            </p>

            <template v-else>
                <section class="bulk-actions">
                    <label class="select-page">
                        <input
                            type="checkbox"
                            :checked="allPageSelected"
                            @change="
                                toggleSelectPage(
                                    ($event.target as HTMLInputElement).checked,
                                )
                            "
                        />

                        <span>
                            {{ t.selectAll }}
                        </span>
                    </label>

                    <button
                        type="button"
                        class="bulk-delete"
                        :disabled="selectedIds.size === 0"
                        @click="bulkConfirmOpen = true"
                    >
                        {{ t.deleteSelected }}
                        ({{ selectedIds.size }})
                    </button>
                </section>

                <section class="routes-grid">
                    <article
                        v-for="(item, index) in pagedRoutes"
                        :key="item.id"
                        class="route-card"
                        :class="{
                            'route-card-selected': selectedIds.has(
                                String(item.id),
                            ),
                        }"
                    >
                        <label class="route-checkbox">
                            <input
                                type="checkbox"
                                :checked="selectedIds.has(String(item.id))"
                                @change="
                                    toggleSelected(
                                        item.id,
                                        ($event.target as HTMLInputElement)
                                            .checked,
                                    )
                                "
                            />

                            <span />
                        </label>

                        <div class="route-number">
                            {{
                                String(
                                    (page - 1) * perPage + index + 1,
                                ).padStart(2, '0')
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
                                    {{ t.duration }}
                                </span>

                                <strong>
                                    {{ item.duration }}

                                    {{
                                        Number(item.duration) === 1
                                            ? t.day
                                            : t.days
                                    }}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {{ t.difficulty }}
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
                            <button type="button" @click="openEdit(item.id)">
                                {{ t.edit }}
                            </button>

                            <button type="button" @click="askDelete(item)">
                                {{ t.delete }}
                            </button>
                        </div>
                    </article>
                </section>

                <div v-if="pagedRoutes.length === 0" class="empty-state">
                    <p>
                        {{ t.noRoutes }}
                    </p>
                </div>

                <Pagination
                    :page="page"
                    :total="total"
                    :per-page="perPage"
                    @update:page="page = $event"
                    @update:per-page="perPage = $event"
                />
            </template>
        </main>

        <div v-if="formOpen" class="modal-overlay" @click.self="closeForm">
            <div class="route-editor-modal" @click.stop>
                <div class="route-editor-top">
                    <div>
                        <div class="modal-mark">
                            ATLAS /
                            {{ formMode === 'edit' ? t.editMark : t.newMark }}
                        </div>

                        <h3>
                            {{ formMode === 'edit' ? t.editRoute : t.newRoute }}
                        </h3>
                    </div>

                    <button
                        type="button"
                        class="editor-close"
                        @click="closeForm"
                    >
                        ×
                    </button>
                </div>

                <p class="route-editor-subtitle">
                    {{ formMode === 'edit' ? t.editSubtitle : t.newSubtitle }}
                </p>

                <form class="route-editor-form" @submit.prevent="saveForm">
                    <div class="field">
                        <label>
                            {{ t.routeName }}
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                            :placeholder="t.routePlaceholder"
                        />

                        <span v-if="errors.name" class="error">
                            {{ errors.name }}
                        </span>
                    </div>

                    <div class="field">
                        <label>
                            {{ t.country }}
                        </label>

                        <select v-model="form.countryId">
                            <option value="">
                                {{ t.selectCountry }}
                            </option>

                            <option
                                v-for="country in countries"
                                :key="country.id"
                                :value="String(country.id)"
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
                                {{ t.duration }}
                            </label>

                            <input
                                v-model="form.duration"
                                type="number"
                                min="1"
                            />

                            <span v-if="errors.duration" class="error">
                                {{ errors.duration }}
                            </span>
                        </div>

                        <div class="field">
                            <label>
                                {{ t.difficulty }}
                            </label>

                            <select v-model="form.difficulty">
                                <option value="">
                                    {{ t.select }}
                                </option>

                                <option value="Easy">
                                    {{ t.easy }}
                                </option>

                                <option value="Medium">
                                    {{ t.medium }}
                                </option>

                                <option value="Hard">
                                    {{ t.hard }}
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
                            @click="closeForm"
                        >
                            {{ t.cancel }}
                        </button>

                        <button type="submit" class="save-button">
                            {{ formMode === 'edit' ? t.save : t.addRoute }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <Modal
            :open="confirmOpen"
            :title="t.deleteRouteTitle"
            :confirm-text="t.delete"
            :cancel-text="t.cancel"
            @close="
                confirmOpen = false;
                toDelete = null;
            "
            @confirm="confirmDelete"
        >
            <template v-if="toDelete">
                {{ t.deleteRouteTextStart }}

                <strong>
                    {{ toDelete.name }} </strong
                >.

                {{ t.cannotUndo }}
            </template>
        </Modal>

        <Modal
            :open="bulkConfirmOpen"
            :title="t.bulkDeleteTitle"
            :confirm-text="t.delete"
            :cancel-text="t.cancel"
            @close="bulkConfirmOpen = false"
            @confirm="confirmBulkDelete"
        >
            {{ t.bulkDeleteStart }}

            <strong>
                {{ selectedIds.size }}
            </strong>

            {{ selectedIds.size === 1 ? t.selectedRoute : t.selectedRoutes }}.

            {{ t.cannotUndo }}
        </Modal>

        <Modal
            :open="leaveConfirmOpen"
            :title="t.discardTitle"
            :confirm-text="t.discard"
            :cancel-text="t.cancel"
            @close="leaveConfirmOpen = false"
            @confirm="finishCloseForm"
        >
            {{ t.discardText }}
        </Modal>
    </div>
</template>
