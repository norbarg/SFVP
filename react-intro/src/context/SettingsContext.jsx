// react-intro/src/context/SettingsContext.jsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'atlas_settings_v1';

const SettingsContext = createContext(null);

const defaultSettings = {
    theme: 'light',
    language: 'en',

    perPage: 5,

    filters: {
        q: '',
        countryId: '',
    },

    sortDir: 'asc',

    page: 1,

    selectedIds: [],
};

const loadSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return defaultSettings;
        }

        const parsed = JSON.parse(saved);

        return {
            theme: parsed.theme ?? defaultSettings.theme,

            language: parsed.language ?? defaultSettings.language,

            perPage: parsed.perPage ?? defaultSettings.perPage,

            filters: {
                q: parsed.filters?.q ?? '',
                countryId: parsed.filters?.countryId ?? '',
            },

            sortDir: parsed.sortDir ?? defaultSettings.sortDir,

            page: parsed.page ?? defaultSettings.page,

            selectedIds: Array.isArray(parsed.selectedIds)
                ? parsed.selectedIds
                : [],
        };
    } catch (error) {
        console.error('Failed to load settings:', error);

        return defaultSettings;
    }
};

export function SettingsProvider({ children }) {
    const savedSettings = useMemo(() => loadSettings(), []);

    const [theme, setTheme] = useState(savedSettings.theme);

    const [language, setLanguage] = useState(savedSettings.language);

    const [perPage, setPerPage] = useState(savedSettings.perPage);

    const [filters, setFilters] = useState(savedSettings.filters);

    const [sortDir, setSortDir] = useState(savedSettings.sortDir);

    const [page, setPage] = useState(savedSettings.page);

    const [selectedIds, setSelectedIds] = useState(
        () => new Set(savedSettings.selectedIds.map(String)),
    );

    useEffect(() => {
        const settings = {
            theme,
            language,
            perPage,
            filters,
            sortDir,
            page,
            selectedIds: [...selectedIds],
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }, [theme, language, perPage, filters, sortDir, page, selectedIds]);

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
