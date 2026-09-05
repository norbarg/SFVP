import { useEffect, useMemo, useState } from 'react';
import {
    useNavigate,
    useParams,
    useSearchParams,
    Link,
} from 'react-router-dom';

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

const emptyForm = {
    name: '',
    countryId: '',
    duration: '',
    difficulty: '',
};

export default function App() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') ?? '';

    const [routes, setRoutes] = useState([]);
    const [countries, setCountries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const [searchQ, setSearchQ] = useState(q);

    const [filterCountry, setFilterCountry] = useState('');

    const [sortDir, setSortDir] = useState('asc');

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const parseId = () => {
        return id ?? null;
    };

    const validate = (values) => {
        const nextErrors = {};

        if (!values.name?.trim()) {
            nextErrors.name = 'Route name is required';
        }

        if (!values.countryId) {
            nextErrors.countryId = 'Country is required';
        }

        if (!values.duration || Number(values.duration) <= 0) {
            nextErrors.duration = 'Duration must be greater than 0';
        }

        if (!values.difficulty) {
            nextErrors.difficulty = 'Difficulty is required';
        }

        return nextErrors;
    };

    const load = async () => {
        setLoading(true);

        try {
            const [routeList, countryList] = await Promise.all([
                getRoutes(q),
                getCountries(),
            ]);

            setRoutes(routeList);
            setCountries(countryList);

            const routeId = parseId();

            if (routeId !== null) {
                let currentRoute = routeList.find(
                    (route) => String(route.id) === String(routeId),
                );
                if (!currentRoute) {
                    try {
                        currentRoute = await getRoute(routeId);
                    } catch {
                        currentRoute = null;
                    }
                }

                if (currentRoute) {
                    setForm({
                        name: currentRoute.name ?? '',
                        countryId: currentRoute.countryId ?? '',
                        duration: currentRoute.duration ?? '',
                        difficulty: currentRoute.difficulty ?? '',
                    });
                } else {
                    navigate(
                        '/routes' + (q ? `?q=${encodeURIComponent(q)}` : ''),
                        { replace: true },
                    );
                }
            } else {
                setForm(emptyForm);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSearchQ(q);
        load();
    }, [id, q]);

    const applySearch = () => {
        const value = searchQ.trim();

        setSearchParams(value ? { q: value } : {});
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

        if (routeId !== null) {
            await updateRoute(routeId, payload);

            navigate('/routes' + (q ? `?q=${encodeURIComponent(q)}` : ''), {
                replace: true,
            });
        } else {
            await createRoute(payload);
        }

        setForm(emptyForm);
        await load();
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

        await load();
    };

    const enrichedRoutes = useMemo(() => {
        return routes.map((route) => ({
            ...route,

            countryName:
                countries.find(
                    (country) => Number(country.id) === Number(route.countryId),
                )?.name ?? 'Unknown',
        }));
    }, [routes, countries]);

    const filteredRoutes = useMemo(() => {
        if (!filterCountry) {
            return enrichedRoutes;
        }

        return enrichedRoutes.filter(
            (route) => String(route.countryId) === String(filterCountry),
        );
    }, [enrichedRoutes, filterCountry]);

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
        setPage(1);
    }, [filterCountry, sortDir, q, perPage]);

    const toggleDurationSort = () => {
        setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <main className="atlas">
            <section className="atlas-intro">
                <p className="atlas-kicker">Travel journal / 2026</p>

                <h1 className="atlas-title">ATLAS.</h1>

                <p className="atlas-description">
                    A small collection of routes for curious travelers.
                </p>
            </section>

            <section className="atlas-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search routes..."
                        value={searchQ}
                        onChange={(event) => setSearchQ(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                applySearch();
                            }
                        }}
                    />

                    <button type="button" onClick={applySearch}>
                        Find
                    </button>
                </div>

                <select
                    value={filterCountry}
                    onChange={(event) => setFilterCountry(event.target.value)}
                >
                    <option value="">All countries</option>

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
                    Duration {sortDir === 'asc' ? '↑' : '↓'}
                </button>

                <Link className="new-route" to="/routes">
                    + New route
                </Link>
            </section>

            <form className="route-form" onSubmit={onSubmit}>
                <div className="form-heading">
                    <span>
                        {parseId() !== null ? 'Edit route' : 'New route'}
                    </span>

                    <small>
                        {parseId() !== null
                            ? 'Update your travel note'
                            : 'Add another place to the journal'}
                    </small>
                </div>

                <div className="field">
                    <label>Route name</label>

                    <input
                        type="text"
                        placeholder="Fjord Echo Trail"
                        value={form.name}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                name: event.target.value,
                            }))
                        }
                    />

                    {errors.name && (
                        <span className="error">{errors.name}</span>
                    )}
                </div>

                <div className="field">
                    <label>Country</label>

                    <select
                        value={form.countryId}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                countryId: event.target.value,
                            }))
                        }
                    >
                        <option value="">Select country...</option>

                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>

                    {errors.countryId && (
                        <span className="error">{errors.countryId}</span>
                    )}
                </div>

                <div className="field">
                    <label>Duration</label>

                    <input
                        type="number"
                        min="1"
                        placeholder="5"
                        value={form.duration}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                duration: event.target.value,
                            }))
                        }
                    />

                    {errors.duration && (
                        <span className="error">{errors.duration}</span>
                    )}
                </div>

                <div className="field">
                    <label>Difficulty</label>

                    <select
                        value={form.difficulty}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                difficulty: event.target.value,
                            }))
                        }
                    >
                        <option value="">Select difficulty...</option>

                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    {errors.difficulty && (
                        <span className="error">{errors.difficulty}</span>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-button">
                        {parseId() !== null ? 'Save changes' : 'Add route'}
                    </button>

                    {parseId() !== null && (
                        <Link
                            className="cancel-button"
                            to={
                                '/routes' +
                                (q ? `?q=${encodeURIComponent(q)}` : '')
                            }
                        >
                            Cancel
                        </Link>
                    )}
                </div>
            </form>

            {loading ? (
                <p className="loading">Loading routes...</p>
            ) : (
                <>
                    <section className="routes-grid">
                        {pagedRoutes.map((route, index) => (
                            <article className="route-card" key={route.id}>
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
                                        <span>Duration</span>

                                        <strong>
                                            {route.duration}{' '}
                                            {Number(route.duration) === 1
                                                ? 'day'
                                                : 'days'}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Difficulty</span>

                                        <strong
                                            className={`difficulty difficulty-${route.difficulty.toLowerCase()}`}
                                        >
                                            {route.difficulty}
                                        </strong>
                                    </div>
                                </div>

                                <div className="route-actions">
                                    <Link
                                        to={
                                            `/routes/${route.id}/edit` +
                                            (q
                                                ? `?q=${encodeURIComponent(q)}`
                                                : '')
                                        }
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => askDelete(route)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>

                    {pagedRoutes.length === 0 && (
                        <div className="empty-state">
                            <p>No routes found.</p>
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

            <Modal
                open={confirmOpen}
                title="Delete route?"
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
            >
                {toDelete ? (
                    <>
                        You are about to delete <strong>{toDelete.name}</strong>
                        . This action cannot be undone.
                    </>
                ) : null}
            </Modal>
        </main>
    );
}
