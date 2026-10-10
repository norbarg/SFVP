import {
    Inject,
    Injectable,
    PLATFORM_ID,
    signal,
} from '@angular/core';

import {
    isPlatformBrowser,
} from '@angular/common';

export type AppLanguage =
    'en' | 'ua';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly key =
        'atlas_language';

    private readonly isBrowser:
        boolean;

    readonly language =
        signal<AppLanguage>(
            'en',
        );

    constructor(
        @Inject(PLATFORM_ID)
        platformId: object,
    ) {
        this.isBrowser =
            isPlatformBrowser(
                platformId,
            );

        if (this.isBrowser) {
            this.language.set(
                this.loadLanguage(),
            );

            this.apply();
        }
    }

    private loadLanguage():
        AppLanguage {
        if (!this.isBrowser) {
            return 'en';
        }

        const saved =
            localStorage.getItem(
                this.key,
            );

        return saved === 'ua'
            ? 'ua'
            : 'en';
    }

    toggle(): void {
        if (!this.isBrowser) {
            return;
        }

        const next:
            AppLanguage =
            this.language() === 'en'
                ? 'ua'
                : 'en';

        this.language.set(
            next,
        );

        localStorage.setItem(
            this.key,
            next,
        );

        this.apply();
    }

    apply(): void {
        if (!this.isBrowser) {
            return;
        }

        document.documentElement.lang =
            this.language() === 'ua'
                ? 'uk'
                : 'en';
    }
}