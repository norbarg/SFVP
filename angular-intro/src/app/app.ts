import {
    Component,
    OnInit,
    inject,
} from '@angular/core';

import {
    RouterOutlet,
} from '@angular/router';

import {
    ThemeService,
} from './core/theme.service';

import {
    LanguageService,
} from './core/language.service';

@Component({
    selector: 'app-root',

    standalone: true,

    imports: [
        RouterOutlet,
    ],

    templateUrl: './app.html',

    styleUrl: './app.css',
})
export class App implements OnInit {
    readonly theme =
        inject(ThemeService);

    readonly language =
        inject(LanguageService);

    ngOnInit(): void {
        this.theme.apply();

        this.language.apply();
    }

    toggleTheme(): void {
        this.theme.toggle();
    }

    toggleLanguage(): void {
        this.language.toggle();
    }
}