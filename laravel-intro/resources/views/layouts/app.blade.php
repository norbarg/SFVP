<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>@yield('title', 'ATLAS')</title>

    <link rel="stylesheet" href="{{ asset('styles/app.css') }}">
</head>

<body>

<div class="atlas-layout">

    <aside class="atlas-sidebar">

        <div class="sidebar-actions">

            <a
                href="{{ route('routes.create') }}"
                class="sidebar-icon-button sidebar-add"
                data-tooltip="New route"
            >
                +
            </a>

            <a
                href="{{ route('routes.index') }}"
                class="sidebar-icon-button"
                data-tooltip="Routes"
            >
                R
            </a>

            <a
                href="{{ route('countries.index') }}"
                class="sidebar-icon-button"
                data-tooltip="Countries"
            >
                C
            </a>

        </div>

        <div class="sidebar-actions">

            <button
                type="button"
                class="sidebar-icon-button"
                id="themeToggle"
                data-tooltip="Theme"
            >
                ☾
            </button>

            <button
                type="button"
                class="sidebar-icon-button"
                id="languageToggle"
                data-tooltip="Language"
            >
                UA
            </button>

            <div class="sidebar-mini-mark">
                A
            </div>

        </div>

    </aside>

    <main class="atlas">
        @yield('content')
    </main>

</div>


<script>
    const translations = {
        en: {
            kicker: 'Curated travel routes',
            description: 'A small collection of routes for curious travelers.',
            search: 'Search routes...',
            allCountries: 'All countries',
            find: 'Search',
            reset: 'Reset',
            duration: 'Duration',
            difficulty: 'Difficulty',
            edit: 'Edit',
            delete: 'Delete',
            noRoutes: 'No routes found.',
            prev: '← Prev',
            next: 'Next →',
            show: 'Show',
            routes: 'Routes',
            countries: 'Countries',
            newRoute: 'New route'
        },

        uk: {
            kicker: 'Добірка туристичних маршрутів',
            description: 'Невелика колекція маршрутів для допитливих мандрівників.',
            search: 'Пошук маршрутів...',
            allCountries: 'Усі країни',
            find: 'Пошук',
            reset: 'Скинути',
            duration: 'Тривалість',
            difficulty: 'Складність',
            edit: 'Редагувати',
            delete: 'Видалити',
            noRoutes: 'Маршрутів не знайдено.',
            prev: '← Назад',
            next: 'Далі →',
            show: 'Показати',
            routes: 'Маршрути',
            countries: 'Країни',
            newRoute: 'Новий маршрут'
        }
    };

    let currentTheme =
        localStorage.getItem('atlas-theme') || 'light';

    let currentLanguage =
        localStorage.getItem('atlas-language') || 'en';

    const themeToggle =
        document.getElementById('themeToggle');

    const languageToggle =
        document.getElementById('languageToggle');


    function applyTheme() {
        document.documentElement.dataset.theme =
            currentTheme;

        themeToggle.textContent =
            currentTheme === 'light'
                ? '☾'
                : '☀';
    }


    function applyLanguage() {
        document.documentElement.lang =
            currentLanguage === 'uk'
                ? 'uk'
                : 'en';

        languageToggle.textContent =
            currentLanguage === 'en'
                ? 'UA'
                : 'EN';

        document
            .querySelectorAll('[data-i18n]')
            .forEach((element) => {

                const key =
                    element.dataset.i18n;

                const value =
                    translations[currentLanguage][key];

                if (value) {
                    element.textContent = value;
                }

            });

        document
            .querySelectorAll('[data-i18n-placeholder]')
            .forEach((element) => {

                const key =
                    element.dataset.i18nPlaceholder;

                const value =
                    translations[currentLanguage][key];

                if (value) {
                    element.placeholder = value;
                }

            });
    }


    themeToggle.addEventListener('click', () => {

        currentTheme =
            currentTheme === 'light'
                ? 'dark'
                : 'light';

        localStorage.setItem(
            'atlas-theme',
            currentTheme
        );

        applyTheme();

    });


    languageToggle.addEventListener('click', () => {

        currentLanguage =
            currentLanguage === 'en'
                ? 'uk'
                : 'en';

        localStorage.setItem(
            'atlas-language',
            currentLanguage
        );

        applyLanguage();

    });


    applyTheme();
    applyLanguage();
</script>

@stack('scripts')

</body>
</html>