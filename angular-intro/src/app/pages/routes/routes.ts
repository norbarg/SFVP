import { CommonModule } from '@angular/common';

import {
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
    inject,
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import {
    ActivatedRoute,
    CanDeactivateFn,
    Router,
} from '@angular/router';

import { forkJoin } from 'rxjs';

import {
    ApiService,
    Country,
    TravelRoute,
} from '../../services/api';

import {
    ListSettingsService,
} from '../../core/list-settings.service';

import {
    LanguageService,
} from '../../core/language.service';

import {
    Modal,
} from '../../components/modal/modal';

import {
    Pagination,
} from '../../components/pagination/pagination';

interface DisplayRoute
    extends TravelRoute {
    countryName: string;
}

const translations = {
    en: {
        kicker:
            'Travel journal / Angular',

        description:
            'A collection of routes for curious travelers.',

        searchPlaceholder:
            'Search routes...',

        allCountries:
            'All countries',

        duration:
            'Duration',

        difficulty:
            'Difficulty',

        loading:
            'Loading routes...',

        selectPage:
            'Select page',

        deleteSelected:
            'Delete selected',

        noRoutes:
            'No routes found.',

        day:
            'day',

        days:
            'days',

        easy:
            'Easy',

        medium:
            'Medium',

        hard:
            'Hard',

        edit:
            'Edit',

        delete:
            'Delete',

        addTooltip:
            'Add route',

        newMark:
            'NEW',

        editMark:
            'EDIT',

        newRoute:
            'New route',

        editRoute:
            'Edit route',

        newSubtitle:
            'Add another place to the journal.',

        editSubtitle:
            'Update your travel note.',

        routeName:
            'Route name',

        routePlaceholder:
            'Fjord Echo Trail',

        country:
            'Country',

        selectCountry:
            'Select country...',

        select:
            'Select...',

        cancel:
            'Cancel',

        save:
            'Save',

        saving:
            'Saving...',

        addRoute:
            'Add route',

        validationName:
            'Route name is required',

        validationCountry:
            'Country is required',

        validationDuration:
            'Duration must be greater than 0',

        validationDifficulty:
            'Difficulty is required',

        deleteTitle:
            'Delete route?',

        deleteStart:
            'You are about to delete',

        cannotUndo:
            'This action cannot be undone.',

        bulkTitle:
            'Delete selected routes?',

        bulkStart:
            'You are about to delete',

        selectedRoute:
            'selected route',

        selectedRoutes:
            'selected routes',

        discardTitle:
            'Discard changes?',

        discardText:
            'You have unsaved changes. If you leave now, they will be lost.',

        discard:
            'Discard',

        unknown:
            'Unknown',

        first:
            'First',

        prev:
            'Prev',

        next:
            'Next',

        last:
            'Last',

        page:
            'Page',

        show:
            'Show',
    },

    ua: {
        kicker:
            'Щоденник подорожей / Angular',

        description:
            'Колекція маршрутів для допитливих мандрівників.',

        searchPlaceholder:
            'Пошук маршрутів...',

        allCountries:
            'Усі країни',

        duration:
            'Тривалість',

        difficulty:
            'Складність',

        loading:
            'Завантаження маршрутів...',

        selectPage:
            'Обрати сторінку',

        deleteSelected:
            'Видалити обрані',

        noRoutes:
            'Маршрутів не знайдено.',

        day:
            'день',

        days:
            'днів',

        easy:
            'Легка',

        medium:
            'Середня',

        hard:
            'Складна',

        edit:
            'Редагувати',

        delete:
            'Видалити',

        addTooltip:
            'Додати маршрут',

        newMark:
            'НОВИЙ',

        editMark:
            'РЕДАГУВАННЯ',

        newRoute:
            'Новий маршрут',

        editRoute:
            'Редагування маршруту',

        newSubtitle:
            'Додайте новий маршрут до щоденника.',

        editSubtitle:
            'Оновіть інформацію про маршрут.',

        routeName:
            'Назва маршруту',

        routePlaceholder:
            'Fjord Echo Trail',

        country:
            'Країна',

        selectCountry:
            'Оберіть країну...',

        select:
            'Оберіть...',

        cancel:
            'Скасувати',

        save:
            'Зберегти',

        saving:
            'Збереження...',

        addRoute:
            'Додати маршрут',

        validationName:
            'Вкажіть назву маршруту',

        validationCountry:
            'Оберіть країну',

        validationDuration:
            'Тривалість повинна бути більшою за 0',

        validationDifficulty:
            'Оберіть складність',

        deleteTitle:
            'Видалити маршрут?',

        deleteStart:
            'Ви збираєтеся видалити',

        cannotUndo:
            'Цю дію неможливо скасувати.',

        bulkTitle:
            'Видалити обрані маршрути?',

        bulkStart:
            'Ви збираєтеся видалити',

        selectedRoute:
            'обраний маршрут',

        selectedRoutes:
            'обраних маршрутів',

        discardTitle:
            'Відхилити зміни?',

        discardText:
            'У вас є незбережені зміни. Якщо вийти зараз, вони будуть втрачені.',

        discard:
            'Відхилити',

        unknown:
            'Невідомо',

        first:
            'Перша',

        prev:
            'Назад',

        next:
            'Далі',

        last:
            'Остання',

        page:
            'Сторінка',

        show:
            'Показати',
    },
};

@Component({
    selector: 'app-routes',

    standalone: true,

    imports: [
        CommonModule,
        ReactiveFormsModule,
        Modal,
        Pagination,
    ],

    templateUrl: './routes.html',
    styleUrl: './routes.css',
})
export class Routes
    implements OnInit {

    private readonly api =
        inject(ApiService);

    private readonly fb =
        inject(FormBuilder);

    private readonly router =
        inject(Router);

    private readonly activatedRoute =
        inject(ActivatedRoute);

    private readonly cdr =
        inject(ChangeDetectorRef);

    private readonly listSettings =
        inject(
            ListSettingsService,
        );

    readonly language =
        inject(
            LanguageService,
        );

    private guardResolver:
        ((result: boolean) => void) |
        null =
        null;

    private localClosePending =
        false;

    private allowNavigation =
        false;

    routes:
        TravelRoute[] = [];

    countries:
        Country[] = [];

    loading = true;

    saving = false;

    bulkDeleting =
        false;

    searchQ =
        this.listSettings.search();

    filterCountry =
        '';

    sortDir:
        'asc' | 'desc' =
        'asc';

    page = 1;

    perPage =
        this.listSettings.pageSize();

    formOpen =
        false;

    editingId:
        string |
        number |
        null =
        null;

    deleteModalOpen =
        false;

    routeToDelete:
        TravelRoute |
        null =
        null;

    bulkDeleteModalOpen =
        false;

    leaveModalOpen =
        false;

    selected =
        new Set<string>();

    form =
        this.fb.nonNullable.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(
                        2,
                    ),
                ],
            ],

            countryId: [
                '',
                Validators.required,
            ],

            duration: [
                1,
                [
                    Validators.required,
                    Validators.min(
                        1,
                    ),
                ],
            ],

            difficulty: [
                '',
                Validators.required,
            ],
        });

    get t() {
        return translations[
            this.language.language()
        ];
    }

    ngOnInit(): void {
        this.loadData();

        this.activatedRoute
            .paramMap
            .subscribe(
                (params) => {
                    const id =
                        params.get(
                            'id',
                        );

                    if (id) {
                        this.editingId =
                            id;

                        this.openEditForm(
                            id,
                        );
                    } else {
                        this.editingId =
                            null;
                    }
                },
            );
    }

    @HostListener(
        'window:beforeunload',
        ['$event'],
    )
    beforeUnload(
        event:
            BeforeUnloadEvent,
    ): void {
        if (
            this.formOpen &&
            this.form.dirty &&
            !this.saving
        ) {
            event.preventDefault();

            event.returnValue =
                '';
        }
    }

    difficultyLabel(
        difficulty: string,
    ): string {
        if (
            difficulty ===
            'Easy'
        ) {
            return this.t.easy;
        }

        if (
            difficulty ===
            'Medium'
        ) {
            return this.t.medium;
        }

        if (
            difficulty ===
            'Hard'
        ) {
            return this.t.hard;
        }

        return difficulty;
    }

    loadData(): void {
        this.loading =
            true;

        this.cdr.detectChanges();

        forkJoin({
            routes:
                this.api.getRoutes(),

            countries:
                this.api.getCountries(),
        }).subscribe({
            next: ({
                routes,
                countries,
            }) => {
                this.routes =
                    routes;

                this.countries =
                    countries;

                this.removeMissingSelections();

                this.loading =
                    false;

                this.cdr.detectChanges();
            },

            error: (
                error,
            ) => {
                console.error(
                    'Failed to load data:',
                    error,
                );

                this.loading =
                    false;

                this.cdr.detectChanges();
            },
        });
    }

    private getId(
        id:
            | string
            | number
            | undefined,
    ): string {
        return String(
            id ?? '',
        );
    }

    private removeMissingSelections():
        void {
        const existingIds =
            new Set(
                this.routes
                    .filter(
                        (
                            item,
                        ) =>
                            item.id !==
                            undefined,
                    )
                    .map(
                        (
                            item,
                        ) =>
                            this.getId(
                                item.id,
                            ),
                    ),
            );

        this.selected =
            new Set(
                [
                    ...this.selected,
                ].filter(
                    (
                        id,
                    ) =>
                        existingIds.has(
                            id,
                        ),
                ),
            );
    }

    get enrichedRoutes():
        DisplayRoute[] {
        return this.routes.map(
            (item) => ({
                ...item,

                countryName:
                    this.countries.find(
                        (
                            country,
                        ) =>
                            Number(
                                country.id,
                            ) ===
                            Number(
                                item.countryId,
                            ),
                    )?.name ??
                    this.t.unknown,
            }),
        );
    }

    get filteredRoutes():
        DisplayRoute[] {
        let result =
            this.enrichedRoutes;

        const search =
            this.searchQ
                .trim()
                .toLowerCase();

        if (search) {
            result =
                result.filter(
                    (
                        item,
                    ) =>
                        item.name
                            .toLowerCase()
                            .includes(
                                search,
                            ),
                );
        }

        if (
            this.filterCountry
        ) {
            result =
                result.filter(
                    (
                        item,
                    ) =>
                        String(
                            item.countryId,
                        ) ===
                        String(
                            this.filterCountry,
                        ),
                );
        }

        return result;
    }

    get sortedRoutes():
        DisplayRoute[] {
        return [
            ...this.filteredRoutes,
        ].sort(
            (
                a,
                b,
            ) => {
                const first =
                    Number(
                        a.duration,
                    );

                const second =
                    Number(
                        b.duration,
                    );

                return this.sortDir ===
                    'asc'
                    ? first -
                          second
                    : second -
                          first;
            },
        );
    }

    get pagedRoutes():
        DisplayRoute[] {
        const start =
            (this.page - 1) *
            this.perPage;

        return this.sortedRoutes.slice(
            start,
            start +
                this.perPage,
        );
    }

    get selectedCount():
        number {
        return this.selected.size;
    }

    get allPageSelected():
        boolean {
        const items =
            this.pagedRoutes.filter(
                (
                    item,
                ) =>
                    item.id !==
                    undefined,
            );

        if (
            items.length ===
            0
        ) {
            return false;
        }

        return items.every(
            (
                item,
            ) =>
                this.selected.has(
                    this.getId(
                        item.id,
                    ),
                ),
        );
    }

    isSelected(
        id:
            | string
            | number
            | undefined,
    ): boolean {
        if (
            id ===
            undefined
        ) {
            return false;
        }

        return this.selected.has(
            this.getId(
                id,
            ),
        );
    }

    toggleOne(
        item:
            TravelRoute,
        event:
            Event,
    ): void {
        if (
            item.id ===
            undefined
        ) {
            return;
        }

        const checkbox =
            event.target as
                HTMLInputElement;

        const id =
            this.getId(
                item.id,
            );

        const next =
            new Set(
                this.selected,
            );

        if (
            checkbox.checked
        ) {
            next.add(
                id,
            );
        } else {
            next.delete(
                id,
            );
        }

        this.selected =
            next;
    }

    togglePage(
        event:
            Event,
    ): void {
        const checkbox =
            event.target as
                HTMLInputElement;

        const next =
            new Set(
                this.selected,
            );

        for (
            const item
            of this.pagedRoutes
        ) {
            if (
                item.id ===
                undefined
            ) {
                continue;
            }

            const id =
                this.getId(
                    item.id,
                );

            if (
                checkbox.checked
            ) {
                next.add(
                    id,
                );
            } else {
                next.delete(
                    id,
                );
            }
        }

        this.selected =
            next;
    }

    askBulkDelete():
        void {
        if (
            this.selectedCount ===
            0
        ) {
            return;
        }

        this.bulkDeleteModalOpen =
            true;

        this.cdr.detectChanges();
    }

    closeBulkDeleteModal():
        void {
        if (
            this.bulkDeleting
        ) {
            return;
        }

        this.bulkDeleteModalOpen =
            false;

        this.cdr.detectChanges();
    }

    confirmBulkDelete():
        void {
        const ids =
            [
                ...this.selected,
            ];

        if (
            ids.length ===
                0 ||
            this.bulkDeleting
        ) {
            return;
        }

        this.bulkDeleting =
            true;

        this.cdr.detectChanges();

        forkJoin(
            ids.map(
                (
                    id,
                ) =>
                    this.api.deleteRoute(
                        id,
                    ),
            ),
        ).subscribe({
            next: () => {
                this.selected =
                    new Set<string>();

                this.bulkDeleting =
                    false;

                this.bulkDeleteModalOpen =
                    false;

                this.page =
                    1;

                this.loadData();
            },

            error: (
                error,
            ) => {
                console.error(
                    'Failed to delete selected routes:',
                    error,
                );

                this.bulkDeleting =
                    false;

                this.cdr.detectChanges();

                window.alert(
                    'Failed to delete selected routes.',
                );
            },
        });
    }

    openCreateForm():
        void {
        this.editingId =
            null;

        this.form.reset({
            name:
                '',
            countryId:
                '',
            duration:
                1,
            difficulty:
                '',
        });

        this.form.markAsPristine();

        this.formOpen =
            true;

        this.cdr.detectChanges();
    }

    openEditForm(
        id:
            | string
            | number,
    ): void {
        this.api
            .getRoute(
                id,
            )
            .subscribe({
                next: (
                    item,
                ) => {
                    this.form.reset({
                        name:
                            item.name,

                        countryId:
                            String(
                                item.countryId,
                            ),

                        duration:
                            Number(
                                item.duration,
                            ),

                        difficulty:
                            item.difficulty,
                    });

                    this.form.markAsPristine();

                    this.formOpen =
                        true;

                    this.cdr.detectChanges();
                },

                error: () => {
                    this.allowNavigation =
                        true;

                    this.router
                        .navigate(
                            [
                                '/routes',
                            ],
                        )
                        .finally(
                            () => {
                                this.allowNavigation =
                                    false;
                            },
                        );
                },
            });
    }

    editRoute(
        id:
            | string
            | number
            | undefined,
    ): void {
        if (
            id ===
            undefined
        ) {
            return;
        }

        this.router.navigate(
            [
                '/routes',
                id,
                'edit',
            ],
        );
    }

    requestCloseForm():
        void {
        if (
            this.saving
        ) {
            return;
        }

        if (
            this.form.dirty
        ) {
            this.localClosePending =
                true;

            this.leaveModalOpen =
                true;

            this.cdr.detectChanges();

            return;
        }

        this.finishCloseForm();
    }

    private finishCloseForm():
        void {
        const wasEditing =
            this.editingId !==
            null;

        this.formOpen =
            false;

        this.form.reset({
            name:
                '',
            countryId:
                '',
            duration:
                1,
            difficulty:
                '',
        });

        this.form.markAsPristine();

        this.localClosePending =
            false;

        this.leaveModalOpen =
            false;

        this.cdr.detectChanges();

        if (
            wasEditing
        ) {
            this.allowNavigation =
                true;

            this.router
                .navigate(
                    [
                        '/routes',
                    ],
                )
                .finally(
                    () => {
                        this.allowNavigation =
                            false;
                    },
                );
        }
    }

    cancelDiscard():
        void {
        this.leaveModalOpen =
            false;

        this.localClosePending =
            false;

        if (
            this.guardResolver
        ) {
            const resolve =
                this.guardResolver;

            this.guardResolver =
                null;

            resolve(
                false,
            );
        }

        this.cdr.detectChanges();
    }

    confirmDiscard():
        void {
        this.leaveModalOpen =
            false;

        this.form.markAsPristine();

        if (
            this.guardResolver
        ) {
            const resolve =
                this.guardResolver;

            this.guardResolver =
                null;

            resolve(
                true,
            );

            return;
        }

        if (
            this.localClosePending
        ) {
            this.localClosePending =
                false;

            this.finishCloseForm();
        }
    }

    canDeactivate():
        boolean |
        Promise<boolean> {
        if (
            this.allowNavigation ||
            this.saving ||
            !this.formOpen ||
            !this.form.dirty
        ) {
            return true;
        }

        this.localClosePending =
            false;

        this.leaveModalOpen =
            true;

        this.cdr.detectChanges();

        return new Promise<boolean>(
            (
                resolve,
            ) => {
                this.guardResolver =
                    resolve;
            },
        );
    }

    submitForm():
        void {
        if (
            this.form.invalid ||
            this.saving
        ) {
            this.form.markAllAsTouched();

            this.cdr.detectChanges();

            return;
        }

        this.saving =
            true;

        this.cdr.detectChanges();

        const value =
            this.form.getRawValue();

        const payload = {
            name:
                value.name.trim(),

            countryId:
                Number(
                    value.countryId,
                ),

            duration:
                Number(
                    value.duration,
                ),

            difficulty:
                value.difficulty,
        };

        if (
            this.editingId
        ) {
            this.api
                .updateRoute(
                    this.editingId,
                    payload,
                )
                .subscribe({
                    next: () => {
                        this.form.markAsPristine();

                        this.saving =
                            false;

                        this.formOpen =
                            false;

                        this.allowNavigation =
                            true;

                        this.cdr.detectChanges();

                        this.router
                            .navigate(
                                [
                                    '/routes',
                                ],
                            )
                            .finally(
                                () => {
                                    this.allowNavigation =
                                        false;
                                },
                            );

                        this.loadData();
                    },

                    error: (
                        error,
                    ) => {
                        console.error(
                            error,
                        );

                        this.saving =
                            false;

                        this.cdr.detectChanges();
                    },
                });

            return;
        }

        this.api
            .createRoute(
                payload,
            )
            .subscribe({
                next: () => {
                    this.form.markAsPristine();

                    this.saving =
                        false;

                    this.formOpen =
                        false;

                    this.form.reset({
                        name:
                            '',
                        countryId:
                            '',
                        duration:
                            1,
                        difficulty:
                            '',
                    });

                    this.cdr.detectChanges();

                    this.loadData();
                },

                error: (
                    error,
                ) => {
                    console.error(
                        error,
                    );

                    this.saving =
                        false;

                    this.cdr.detectChanges();
                },
            });
    }

    askDelete(
        item:
            TravelRoute,
    ): void {
        this.routeToDelete =
            item;

        this.deleteModalOpen =
            true;

        this.cdr.detectChanges();
    }

    closeDeleteModal():
        void {
        this.deleteModalOpen =
            false;

        this.routeToDelete =
            null;

        this.cdr.detectChanges();
    }

    confirmDelete():
        void {
        const id =
            this.routeToDelete
                ?.id;

        if (
            id ===
            undefined
        ) {
            return;
        }

        this.api
            .deleteRoute(
                id,
            )
            .subscribe({
                next: () => {
                    this.selected.delete(
                        this.getId(
                            id,
                        ),
                    );

                    this.selected =
                        new Set(
                            this.selected,
                        );

                    this.closeDeleteModal();

                    this.loadData();
                },

                error: (
                    error,
                ) => {
                    console.error(
                        error,
                    );

                    this.cdr.detectChanges();
                },
            });
    }

    toggleSort():
        void {
        this.sortDir =
            this.sortDir ===
            'asc'
                ? 'desc'
                : 'asc';

        this.page =
            1;
    }

    onSearch(
        event:
            Event,
    ): void {
        const input =
            event.target as
                HTMLInputElement;

        this.searchQ =
            input.value;

        this.listSettings.setSearch(
            this.searchQ,
        );

        this.page =
            1;
    }

    onCountryChange(
        event:
            Event,
    ): void {
        const select =
            event.target as
                HTMLSelectElement;

        this.filterCountry =
            select.value;

        this.page =
            1;
    }

    changePage(
        page:
            number,
    ): void {
        this.page =
            page;
    }

    changePerPage(
        value:
            number,
    ): void {
        this.perPage =
            value;

        this.listSettings.setPageSize(
            value,
        );

        this.page =
            1;
    }
}

export const canDeactivateEdit:
    CanDeactivateFn<Routes> =
    (
        component,
    ) =>
        component.canDeactivate();