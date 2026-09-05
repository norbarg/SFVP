// react-intro/src/App.jsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
    getRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    getCountries,
} from './api';

import Modal from './Modal.jsx';
import Pagination from './Pagination.jsx';
import { useSettings } from './context/SettingsContext.jsx';
import ConfirmLeave from './ConfirmLeave.jsx';

const emptyForm = {
    name: '',
    countryId: '',
    duration: '',
    difficulty: '',
};

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

export default function App() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        theme,
        setTheme,

        language,
        setLanguage,

        perPage,
        setPerPage,

        filters,
        setFilters,

        sortDir,
        setSortDir,

        page,
        setPage,

        selectedIds,
        setSelectedIds,
    } = useSettings();

    const t = translations[language];

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') ?? '';

    const [routes, setRoutes] = useState([]);
    const [countries, setCountries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [dirty, setDirty] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [formMode, setFormMode] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
    const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);

    const settingsMounted = useRef(false);

    const parseId = () => id ?? null;

    const validate = (values) => {
        const nextErrors = {};

        if (!values.name?.trim()) {
            nextErrors.name = t.validationName;
        }

        if (!values.countryId) {
            nextErrors.countryId = t.validationCountry;
        }

        if (!values.duration || Number(values.duration) <= 0) {
            nextErrors.duration = t.validationDuration;
        }

        if (!values.difficulty) {
            nextErrors.difficulty = t.validationDifficulty;
        }

        return nextErrors;
    };

    const loadData = async () => {
        setLoading(true);

        try {
            const [routeList, countryList] = await Promise.all([
                getRoutes(),
                getCountries(),
            ]);

            setRoutes(routeList);
            setCountries(countryList);

            return {
                routeList,
                countryList,
            };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        document.documentElement.lang = language === 'ua' ? 'uk' : 'en';
    }, [language]);

    useEffect(() => {
        if (q && q !== filters.q) {
            setFilters((current) => ({
                ...current,
                q,
            }));
        }

        loadData();
    }, [q]);

    useEffect(() => {
        if (!q && filters.q) {
            setSearchParams(
                {
                    q: filters.q,
                },
                {
                    replace: true,
                },
            );
        }
    }, []);

    useEffect(() => {
        const routeId = parseId();

        if (routeId === null) {
            if (formMode === 'edit') {
                setFormOpen(false);
                setFormMode(null);
                setDirty(false);
                setErrors({});
            }

            return;
        }

        const openEditRoute = async () => {
            try {
                const currentRoute = await getRoute(routeId);

                setForm({
                    name: currentRoute.name ?? '',
                    countryId: currentRoute.countryId ?? '',
                    duration: currentRoute.duration ?? '',
                    difficulty: currentRoute.difficulty ?? '',
                });

                setErrors({});
                setDirty(false);
                setFormMode('edit');
                setFormOpen(true);
            } catch {
                navigate('/routes' + (q ? `?q=${encodeURIComponent(q)}` : ''), {
                    replace: true,
                });
            }
        };

        openEditRoute();
    }, [id]);

    const applySearch = () => {
        const value = filters.q.trim();

        setSearchParams(
            value
                ? {
                      q: value,
                  }
                : {},
        );
    };

    const updateForm = (patch) => {
        setDirty(true);

        setForm((current) => ({
            ...current,
            ...patch,
        }));
    };

    const openCreateModal = () => {
        setForm(emptyForm);
        setErrors({});
        setDirty(false);
        setFormMode('create');
        setFormOpen(true);
    };

    const openEditModal = (routeId) => {
        navigate(
            `/routes/${routeId}/edit` +
                (q ? `?q=${encodeURIComponent(q)}` : ''),
        );
    };

    const finishCloseForm = () => {
        setDirty(false);
        setErrors({});
        setFormOpen(false);
        setLeaveConfirmOpen(false);

        if (formMode === 'edit') {
            navigate('/routes' + (q ? `?q=${encodeURIComponent(q)}` : ''), {
                replace: true,
            });
        }

        setFormMode(null);
        setForm(emptyForm);
    };

    const closeFormModal = () => {
        if (dirty) {
            setLeaveConfirmOpen(true);
            return;
        }

        finishCloseForm();
    };

    const confirmLeave = () => {
        finishCloseForm();
    };

    const cancelLeave = () => {
        setLeaveConfirmOpen(false);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            name: form.name.trim(),
            countryId: Number(form.countryId),
            duration: Number(form.duration),
            difficulty: form.difficulty,
        };

        const nextErrors = validate(payload);

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        const routeId = parseId();

        if (formMode === 'edit' && routeId !== null) {
            await updateRoute(routeId, payload);
        } else {
            await createRoute(payload);
        }

        setDirty(false);
        setErrors({});
        setForm(emptyForm);
        setFormOpen(false);
        setFormMode(null);

        if (routeId !== null) {
            navigate('/routes' + (q ? `?q=${encodeURIComponent(q)}` : ''), {
                replace: true,
            });
        }

        await loadData();
    };

    const askDelete = (route) => {
        setToDelete(route);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!toDelete) return;

        await deleteRoute(toDelete.id);

        setConfirmOpen(false);
        setToDelete(null);

        await loadData();
    };

    const confirmBulkDelete = async () => {
        const ids = [...selectedIds];

        await Promise.all(ids.map((routeId) => deleteRoute(routeId)));

        setSelectedIds(new Set());
        setBulkConfirmOpen(false);

        await loadData();
    };

    const enrichedRoutes = useMemo(() => {
        return routes.map((route) => ({
            ...route,

            countryName:
                countries.find(
                    (country) => Number(country.id) === Number(route.countryId),
                )?.name ?? t.unknown,
        }));
    }, [routes, countries, t.unknown]);

    const filteredRoutes = useMemo(() => {
        let result = enrichedRoutes;

        if (filters.q) {
            const search = filters.q.trim().toLowerCase();

            result = result.filter((route) =>
                route.name.toLowerCase().includes(search),
            );
        }

        if (filters.countryId) {
            result = result.filter(
                (route) =>
                    String(route.countryId) === String(filters.countryId),
            );
        }

        return result;
    }, [enrichedRoutes, filters]);

    const sortedRoutes = useMemo(() => {
        return [...filteredRoutes].sort((a, b) => {
            const first = Number(a.duration);
            const second = Number(b.duration);

            return sortDir === 'asc' ? first - second : second - first;
        });
    }, [filteredRoutes, sortDir]);

    const total = sortedRoutes.length;

    const pagedRoutes = useMemo(() => {
        const start = (page - 1) * perPage;

        return sortedRoutes.slice(start, start + perPage);
    }, [sortedRoutes, page, perPage]);

    useEffect(() => {
        if (loading) return;

        const actualPages = Math.max(
            1,
            Math.ceil(sortedRoutes.length / perPage),
        );

        if (page > actualPages) {
            setPage(actualPages);
        }
    }, [loading, page, sortedRoutes.length, perPage, setPage]);

    const pageIds = useMemo(
        () => pagedRoutes.map((route) => String(route.id)),
        [pagedRoutes],
    );

    const allPageSelected =
        pageIds.length > 0 &&
        pageIds.every((routeId) => selectedIds.has(routeId));

    const toggleSelectPage = (checked) => {
        setSelectedIds((current) => {
            const next = new Set(current);

            pageIds.forEach((routeId) => {
                if (checked) {
                    next.add(routeId);
                } else {
                    next.delete(routeId);
                }
            });

            return next;
        });
    };

    const toggleSelected = (routeId, checked) => {
        setSelectedIds((current) => {
            const next = new Set(current);
            const key = String(routeId);

            if (checked) {
                next.add(key);
            } else {
                next.delete(key);
            }

            return next;
        });
    };

    useEffect(() => {
        if (!settingsMounted.current) {
            settingsMounted.current = true;
            return;
        }

        setPage(1);
    }, [filters.q, filters.countryId, sortDir, perPage]);

    const toggleDurationSort = () => {
        setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
    };

    const difficultyLabel = (difficulty) => {
        if (difficulty === 'Easy') {
            return t.easy;
        }

        if (difficulty === 'Medium') {
            return t.medium;
        }

        if (difficulty === 'Hard') {
            return t.hard;
        }

        return difficulty;
    };

    return (
        <div className="atlas-layout">
            <ConfirmLeave enabled={dirty && formOpen} />

            <aside className="atlas-sidebar">
                <div className="sidebar-actions">
                    <button
                        type="button"
                        className="sidebar-icon-button sidebar-add"
                        data-tooltip={t.addRouteTooltip}
                        aria-label={t.addRouteTooltip}
                        onClick={openCreateModal}
                    >
                        +
                    </button>

                    <button
                        type="button"
                        className="sidebar-icon-button sidebar-theme"
                        data-tooltip={
                            theme === 'light' ? t.darkMode : t.lightMode
                        }
                        aria-label={
                            theme === 'light' ? t.darkMode : t.lightMode
                        }
                        onClick={() =>
                            setTheme((current) =>
                                current === 'light' ? 'dark' : 'light',
                            )
                        }
                    >
                        {theme === 'light' ? '◐' : '○'}
                    </button>

                    <button
                        type="button"
                        className="sidebar-icon-button"
                        data-tooltip={t.languageTooltip}
                        aria-label={t.languageTooltip}
                        onClick={() =>
                            setLanguage(language === 'en' ? 'ua' : 'en')
                        }
                    >
                        {language === 'en' ? 'UA' : 'EN'}
                    </button>
                </div>

                <div className="sidebar-mini-mark">A</div>
            </aside>

            <main className="atlas">
                <section className="atlas-intro">
                    <p className="atlas-kicker">{t.kicker}</p>

                    <h1 className="atlas-title">ATLAS.</h1>

                    <p className="atlas-description">{t.description}</p>
                </section>

                <section className="atlas-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={filters.q}
                            onChange={(event) =>
                                setFilters((current) => ({
                                    ...current,
                                    q: event.target.value,
                                }))
                            }
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    applySearch();
                                }
                            }}
                        />

                        <button type="button" onClick={applySearch}>
                            {t.find}
                        </button>
                    </div>

                    <select
                        value={filters.countryId}
                        onChange={(event) =>
                            setFilters((current) => ({
                                ...current,
                                countryId: event.target.value,
                            }))
                        }
                    >
                        <option value="">{t.allCountries}</option>

                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="sort-button"
                        onClick={toggleDurationSort}
                    >
                        {t.duration} {sortDir === 'asc' ? '↑' : '↓'}
                    </button>
                </section>

                {loading ? (
                    <p className="loading">{t.loading}</p>
                ) : (
                    <>
                        <section className="bulk-actions">
                            <label className="select-page">
                                <input
                                    type="checkbox"
                                    checked={allPageSelected}
                                    onChange={(event) =>
                                        toggleSelectPage(event.target.checked)
                                    }
                                />

                                <span>{t.selectAll}</span>
                            </label>

                            <button
                                type="button"
                                className="bulk-delete"
                                disabled={selectedIds.size === 0}
                                onClick={() => setBulkConfirmOpen(true)}
                            >
                                {t.deleteSelected} ({selectedIds.size})
                            </button>
                        </section>

                        <section className="routes-grid">
                            {pagedRoutes.map((route, index) => (
                                <article
                                    className={`route-card ${
                                        selectedIds.has(String(route.id))
                                            ? 'route-card-selected'
                                            : ''
                                    }`}
                                    key={route.id}
                                >
                                    <label className="route-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(
                                                String(route.id),
                                            )}
                                            onChange={(event) =>
                                                toggleSelected(
                                                    route.id,
                                                    event.target.checked,
                                                )
                                            }
                                        />

                                        <span />
                                    </label>

                                    <div className="route-number">
                                        {String(
                                            (page - 1) * perPage + index + 1,
                                        ).padStart(2, '0')}
                                    </div>

                                    <p className="route-country">
                                        {route.countryName}
                                    </p>

                                    <h2>{route.name}</h2>

                                    <div className="route-meta">
                                        <div>
                                            <span>{t.duration}</span>

                                            <strong>
                                                {route.duration}{' '}
                                                {Number(route.duration) === 1
                                                    ? t.day
                                                    : t.days}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>{t.difficulty}</span>

                                            <strong
                                                className={`difficulty difficulty-${route.difficulty.toLowerCase()}`}
                                            >
                                                {difficultyLabel(
                                                    route.difficulty,
                                                )}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="route-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(route.id)
                                            }
                                        >
                                            {t.edit}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => askDelete(route)}
                                        >
                                            {t.delete}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </section>

                        {pagedRoutes.length === 0 && (
                            <div className="empty-state">
                                <p>{t.noRoutes}</p>
                            </div>
                        )}

                        <Pagination
                            page={page}
                            total={total}
                            perPage={perPage}
                            onPage={setPage}
                            onPerPage={setPerPage}
                        />
                    </>
                )}
            </main>

            {formOpen && (
                <div className="modal-overlay" onClick={closeFormModal}>
                    <div
                        className="route-editor-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="route-editor-top">
                            <div>
                                <div className="modal-mark">
                                    ATLAS /{' '}
                                    {formMode === 'edit'
                                        ? t.editMark
                                        : t.newMark}
                                </div>

                                <h3>
                                    {formMode === 'edit'
                                        ? t.editRoute
                                        : t.newRoute}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="editor-close"
                                onClick={closeFormModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="route-editor-subtitle">
                            {formMode === 'edit'
                                ? t.editSubtitle
                                : t.newSubtitle}
                        </p>

                        <form className="route-editor-form" onSubmit={onSubmit}>
                            <div className="field">
                                <label>{t.routeName}</label>

                                <input
                                    type="text"
                                    placeholder={t.routePlaceholder}
                                    value={form.name}
                                    onChange={(event) =>
                                        updateForm({
                                            name: event.target.value,
                                        })
                                    }
                                />

                                {errors.name && (
                                    <span className="error">{errors.name}</span>
                                )}
                            </div>

                            <div className="field">
                                <label>{t.country}</label>

                                <select
                                    value={form.countryId}
                                    onChange={(event) =>
                                        updateForm({
                                            countryId: event.target.value,
                                        })
                                    }
                                >
                                    <option value="">{t.selectCountry}</option>

                                    {countries.map((country) => (
                                        <option
                                            key={country.id}
                                            value={country.id}
                                        >
                                            {country.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.countryId && (
                                    <span className="error">
                                        {errors.countryId}
                                    </span>
                                )}
                            </div>

                            <div className="route-editor-row">
                                <div className="field">
                                    <label>{t.duration}</label>

                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="5"
                                        value={form.duration}
                                        onChange={(event) =>
                                            updateForm({
                                                duration: event.target.value,
                                            })
                                        }
                                    />

                                    {errors.duration && (
                                        <span className="error">
                                            {errors.duration}
                                        </span>
                                    )}
                                </div>

                                <div className="field">
                                    <label>{t.difficulty}</label>

                                    <select
                                        value={form.difficulty}
                                        onChange={(event) =>
                                            updateForm({
                                                difficulty: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="">{t.select}</option>

                                        <option value="Easy">{t.easy}</option>

                                        <option value="Medium">
                                            {t.medium}
                                        </option>

                                        <option value="Hard">{t.hard}</option>
                                    </select>

                                    {errors.difficulty && (
                                        <span className="error">
                                            {errors.difficulty}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="route-editor-actions">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeFormModal}
                                >
                                    {t.cancel}
                                </button>

                                <button type="submit" className="save-button">
                                    {formMode === 'edit' ? t.save : t.addRoute}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Modal
                open={confirmOpen}
                title={t.deleteRouteTitle}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                confirmText={t.delete}
                cancelText={t.cancel}
            >
                {toDelete ? (
                    <>
                        {t.deleteRouteTextStart}{' '}
                        <strong>{toDelete.name}</strong>. {t.cannotUndo}
                    </>
                ) : null}
            </Modal>

            <Modal
                open={bulkConfirmOpen}
                title={t.bulkDeleteTitle}
                onClose={() => setBulkConfirmOpen(false)}
                onConfirm={confirmBulkDelete}
                confirmText={t.delete}
                cancelText={t.cancel}
            >
                {t.bulkDeleteStart} <strong>{selectedIds.size}</strong>{' '}
                {selectedIds.size === 1 ? t.selectedRoute : t.selectedRoutes}.{' '}
                {t.cannotUndo}
            </Modal>

            <Modal
                open={leaveConfirmOpen}
                title={t.discardTitle}
                onClose={cancelLeave}
                onConfirm={confirmLeave}
                confirmText={t.discard}
                cancelText={t.cancel}
            >
                {t.discardText}
            </Modal>
        </div>
    );
}
