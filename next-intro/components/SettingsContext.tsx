'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react';

type Theme = 'light' | 'dark';

type Language = 'en' | 'ua';

type SortDir = 'asc' | 'desc';

type Filters = {
    q: string;
    countryId: string;
};

type SettingsContextType = {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;

    language: Language;
    setLanguage: Dispatch<SetStateAction<Language>>;

    perPage: number;
    setPerPage: Dispatch<SetStateAction<number>>;

    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;

    sortDir: SortDir;
    setSortDir: Dispatch<SetStateAction<SortDir>>;

    page: number;
    setPage: Dispatch<SetStateAction<number>>;

    selectedIds: Set<string>;

    setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
};

const STORAGE_KEY = 'atlas_next_settings_v1';

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    const [language, setLanguage] = useState<Language>('en');

    const [perPage, setPerPage] = useState(5);

    const [filters, setFilters] = useState<Filters>({
        q: '',
        countryId: '',
    });

    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const [page, setPage] = useState(1);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                setLoaded(true);

                return;
            }

            const saved = JSON.parse(raw);

            if (saved.theme === 'light' || saved.theme === 'dark') {
                setTheme(saved.theme);
            }

            if (saved.language === 'en' || saved.language === 'ua') {
                setLanguage(saved.language);
            }

            if ([5, 10, 20].includes(Number(saved.perPage))) {
                setPerPage(Number(saved.perPage));
            }

            if (saved.filters) {
                setFilters({
                    q: saved.filters.q ?? '',

                    countryId: saved.filters.countryId ?? '',
                });
            }

            if (saved.sortDir === 'asc' || saved.sortDir === 'desc') {
                setSortDir(saved.sortDir);
            }

            if (Number(saved.page) >= 1) {
                setPage(Number(saved.page));
            }
        } catch (error) {
            console.error('Failed to restore settings:', error);
        } finally {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!loaded) {
            return;
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                theme,
                language,
                perPage,
                filters,
                sortDir,
                page,
            }),
        );
    }, [loaded, theme, language, perPage, filters, sortDir, page]);

    const value = useMemo(
        () => ({
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
        }),
        [theme, language, perPage, filters, sortDir, page, selectedIds],
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used inside SettingsProvider');
    }

    return context;
}
