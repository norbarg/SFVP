import { CommonModule } from '@angular/common';

import {
    ChangeDetectorRef,
    Component,
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
    Router,
} from '@angular/router';

import { forkJoin } from 'rxjs';

import {
    ApiService,
    Country,
    TravelRoute,
} from '../../services/api';

import { Modal } from '../../components/modal/modal';
import { Pagination } from '../../components/pagination/pagination';

interface DisplayRoute extends TravelRoute {
    countryName: string;
}

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
export class Routes implements OnInit {
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

    routes: TravelRoute[] = [];
    countries: Country[] = [];

    loading = true;
    saving = false;

    searchQ = '';
    filterCountry = '';

    sortDir: 'asc' | 'desc' = 'asc';

    page = 1;
    perPage = 5;

    formOpen = false;

    editingId:
        string | number | null = null;

    deleteModalOpen = false;

    routeToDelete:
        TravelRoute | null = null;

    form = this.fb.nonNullable.group({
        name: [
            '',
            [
                Validators.required,
                Validators.minLength(2),
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
                Validators.min(1),
            ],
        ],

        difficulty: [
            '',
            Validators.required,
        ],
    });

    ngOnInit(): void {
        this.loadData();

        this.activatedRoute.paramMap.subscribe(
            (params) => {
                const id =
                    params.get('id');

                if (id) {
                    this.editingId = id;

                    this.openEditForm(id);
                } else {
                    this.editingId = null;
                }
            },
        );
    }

    loadData(): void {
        this.loading = true;

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
                this.routes = routes;

                this.countries =
                    countries;

                this.loading = false;

                this.cdr.detectChanges();
            },

            error: (error) => {
                console.error(
                    'Failed to load data:',
                    error,
                );

                this.loading = false;

                this.cdr.detectChanges();
            },
        });
    }

    get enrichedRoutes(): DisplayRoute[] {
        return this.routes.map(
            (item) => ({
                ...item,

                countryName:
                    this.countries.find(
                        (country) =>
                            Number(
                                country.id,
                            ) ===
                            Number(
                                item.countryId,
                            ),
                    )?.name ??
                    'Unknown',
            }),
        );
    }

    get filteredRoutes(): DisplayRoute[] {
        let result =
            this.enrichedRoutes;

        const search =
            this.searchQ
                .trim()
                .toLowerCase();

        if (search) {
            result = result.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(search),
            );
        }

        if (
            this.filterCountry
        ) {
            result = result.filter(
                (item) =>
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

    get sortedRoutes(): DisplayRoute[] {
        return [
            ...this.filteredRoutes,
        ].sort((a, b) => {
            const first =
                Number(a.duration);

            const second =
                Number(b.duration);

            return this.sortDir ===
                'asc'
                ? first - second
                : second - first;
        });
    }

    get pagedRoutes(): DisplayRoute[] {
        const start =
            (this.page - 1) *
            this.perPage;

        return this.sortedRoutes.slice(
            start,
            start + this.perPage,
        );
    }

    openCreateForm(): void {
        this.editingId = null;

        this.form.reset({
            name: '',
            countryId: '',
            duration: 1,
            difficulty: '',
        });

        this.formOpen = true;

        this.cdr.detectChanges();
    }

    openEditForm(
        id: string | number,
    ): void {
        this.api
            .getRoute(id)
            .subscribe({
                next: (item) => {
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

                    this.formOpen =
                        true;

                    this.cdr.detectChanges();
                },

                error: () => {
                    this.router.navigate([
                        '/routes',
                    ]);
                },
            });
    }

    editRoute(
        id: string | number | undefined,
    ): void {
        if (
            id === undefined
        ) {
            return;
        }

        this.router.navigate([
            '/routes',
            id,
            'edit',
        ]);
    }

    closeForm(): void {
        this.formOpen = false;

        this.form.reset({
            name: '',
            countryId: '',
            duration: 1,
            difficulty: '',
        });

        this.cdr.detectChanges();

        if (this.editingId) {
            this.router.navigate([
                '/routes',
            ]);
        }
    }

    submitForm(): void {
        if (
            this.form.invalid ||
            this.saving
        ) {
            this.form.markAllAsTouched();

            this.cdr.detectChanges();

            return;
        }

        this.saving = true;

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

        if (this.editingId) {
            this.api
                .updateRoute(
                    this.editingId,
                    payload,
                )
                .subscribe({
                    next: () => {
                        this.saving =
                            false;

                        this.formOpen =
                            false;

                        this.cdr.detectChanges();

                        this.router.navigate([
                            '/routes',
                        ]);

                        this.loadData();
                    },

                    error: (error) => {
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
            .createRoute(payload)
            .subscribe({
                next: () => {
                    this.saving =
                        false;

                    this.formOpen =
                        false;

                    this.form.reset({
                        name: '',
                        countryId: '',
                        duration: 1,
                        difficulty: '',
                    });

                    this.cdr.detectChanges();

                    this.loadData();
                },

                error: (error) => {
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
        item: TravelRoute,
    ): void {
        this.routeToDelete =
            item;

        this.deleteModalOpen =
            true;

        this.cdr.detectChanges();
    }

    closeDeleteModal(): void {
        this.deleteModalOpen =
            false;

        this.routeToDelete =
            null;

        this.cdr.detectChanges();
    }

    confirmDelete(): void {
        const id =
            this.routeToDelete?.id;

        if (
            id === undefined
        ) {
            return;
        }

        this.api
            .deleteRoute(id)
            .subscribe({
                next: () => {
                    this.closeDeleteModal();

                    this.loadData();
                },

                error: (error) => {
                    console.error(
                        error,
                    );

                    this.cdr.detectChanges();
                },
            });
    }

    toggleSort(): void {
        this.sortDir =
            this.sortDir ===
            'asc'
                ? 'desc'
                : 'asc';

        this.page = 1;
    }

    onSearch(
        event: Event,
    ): void {
        const input =
            event.target as HTMLInputElement;

        this.searchQ =
            input.value;

        this.page = 1;
    }

    onCountryChange(
        event: Event,
    ): void {
        const select =
            event.target as HTMLSelectElement;

        this.filterCountry =
            select.value;

        this.page = 1;
    }

    changePage(
        page: number,
    ): void {
        this.page = page;
    }

    changePerPage(
        value: number,
    ): void {
        this.perPage = value;

        this.page = 1;
    }
}