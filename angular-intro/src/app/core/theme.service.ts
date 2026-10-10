import {
    Inject,
    Injectable,
    PLATFORM_ID,
    signal,
} from '@angular/core';

import {
    isPlatformBrowser,
} from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly key =
        'atlas_theme';

    private readonly isBrowser:
        boolean;

    readonly theme =
        signal<'light' | 'dark'>(
            'light',
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
            this.theme.set(
                this.loadTheme(),
            );
        }
    }

    private loadTheme():
        'light' | 'dark' {
        if (!this.isBrowser) {
            return 'light';
        }

        const saved =
            localStorage.getItem(
                this.key,
            );

        return saved === 'dark'
            ? 'dark'
            : 'light';
    }

    toggle(): void {
        if (!this.isBrowser) {
            return;
        }

        const next =
            this.theme() === 'light'
                ? 'dark'
                : 'light';

        this.theme.set(next);

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

        document.documentElement.setAttribute(
            'data-theme',
            this.theme(),
        );
    }
}