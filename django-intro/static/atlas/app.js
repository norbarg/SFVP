const translations = {
    en: {
        kicker: 'Curated travel routes',
        description: 'A small collection of routes for curious travelers.',
        search: 'Search routes...',
        allCountries: 'All countries',
        find: 'Search',
        duration: 'Duration',
        difficulty: 'Difficulty',
        edit: 'Edit',
        delete: 'Delete',
        noRoutes: 'No routes found.',
        prev: '← Prev',
        next: 'Next →',
        show: 'Show',
    },

    uk: {
        kicker: 'Добірка туристичних маршрутів',
        description: 'Невелика колекція маршрутів для допитливих мандрівників.',
        search: 'Пошук маршрутів...',
        allCountries: 'Усі країни',
        find: 'Пошук',
        duration: 'Тривалість',
        difficulty: 'Складність',
        edit: 'Редагувати',
        delete: 'Видалити',
        noRoutes: 'Маршрутів не знайдено.',
        prev: '← Назад',
        next: 'Далі →',
        show: 'Показати',
    },
};

let currentTheme = localStorage.getItem('atlas-theme') || 'light';

let currentLanguage = localStorage.getItem('atlas-language') || 'en';

const themeToggle = document.getElementById('themeToggle');

const languageToggle = document.getElementById('languageToggle');

function applyTheme() {
    document.documentElement.dataset.theme = currentTheme;

    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '☾' : '☀';
    }
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage === 'uk' ? 'uk' : 'en';

    if (languageToggle) {
        languageToggle.textContent = currentLanguage === 'en' ? 'UA' : 'EN';
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;

        const value = translations[currentLanguage][key];

        if (value) {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.dataset.i18nPlaceholder;

        const value = translations[currentLanguage][key];

        if (value) {
            element.placeholder = value;
        }
    });
}

themeToggle?.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';

    localStorage.setItem('atlas-theme', currentTheme);

    applyTheme();
});

languageToggle?.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'uk' : 'en';

    localStorage.setItem('atlas-language', currentLanguage);

    applyLanguage();
});

const Modal = {
    el: null,
    titleEl: null,
    bodyEl: null,
    confirmBtn: null,
    form: null,

    init() {
        this.el = document.getElementById('modal');

        this.titleEl = document.getElementById('modal-title');

        this.bodyEl = document.getElementById('modal-body');

        this.confirmBtn = document.getElementById('modal-confirm');
    },

    open(title, body, form) {
        this.init();

        this.form = form;

        this.titleEl.textContent = title;

        this.bodyEl.textContent = body;

        this.el.classList.add('show');

        this.confirmBtn.onclick = () => {
            if (this.form) {
                this.form.submit();
            }

            this.close();
        };
    },

    close() {
        this.el?.classList.remove('show');

        this.form = null;
    },

    confirm(title, body, form) {
        this.open(title, body, form);

        return false;
    },
};

window.Modal = Modal;

applyTheme();
applyLanguage();
