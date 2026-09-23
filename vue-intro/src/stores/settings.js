import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'atlas_vue_settings_v1';

export const useSettingsStore = defineStore('settings', () => {
    const theme = ref('light');
    const language = ref('en');

    const perPage = ref(5);

    const searchQ = ref('');
    const filterCountry = ref('');
    const sortDir = ref('asc');

    const loadFromStorage = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return;
            }

            const settings = JSON.parse(saved);

            if (settings.theme) {
                theme.value = settings.theme;
            }

            if (settings.language) {
                language.value = settings.language;
            }

            if (settings.perPage) {
                perPage.value = settings.perPage;
            }

            if (typeof settings.searchQ === 'string') {
                searchQ.value = settings.searchQ;
            }

            if (typeof settings.filterCountry === 'string') {
                filterCountry.value = settings.filterCountry;
            }

            if (settings.sortDir) {
                sortDir.value = settings.sortDir;
            }
        } catch (error) {
            console.error('Failed to load settings from LocalStorage:', error);
        }
    };

    const saveToStorage = () => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    theme: theme.value,
                    language: language.value,
                    perPage: perPage.value,
                    searchQ: searchQ.value,
                    filterCountry: filterCountry.value,
                    sortDir: sortDir.value,
                }),
            );
        } catch (error) {
            console.error('Failed to save settings to LocalStorage:', error);
        }
    };

    watch(
        [theme, language, perPage, searchQ, filterCountry, sortDir],
        saveToStorage,
        {
            deep: true,
        },
    );

    return {
        theme,
        language,
        perPage,
        searchQ,
        filterCountry,
        sortDir,

        loadFromStorage,
        saveToStorage,
    };
});
