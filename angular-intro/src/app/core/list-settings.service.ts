import {
    Injectable,
    signal,
} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ListSettingsService {
    private readonly searchKey =
        'atlas_search';

    private readonly pageSizeKey =
        'atlas_page_size';

    readonly search =
        signal(
            this.loadSearch(),
        );

    readonly pageSize =
        signal(
            this.loadPageSize(),
        );

    private loadSearch(): string {
        if (
            typeof localStorage ===
            'undefined'
        ) {
            return '';
        }

        return (
            localStorage.getItem(
                this.searchKey,
            ) ?? ''
        );
    }

    private loadPageSize(): number {
        if (
            typeof localStorage ===
            'undefined'
        ) {
            return 5;
        }

        const saved =
            Number(
                localStorage.getItem(
                    this.pageSizeKey,
                ),
            );

        return [
            5,
            10,
            20,
            50,
            100,
        ].includes(saved)
            ? saved
            : 5;
    }

    setSearch(
        value: string,
    ): void {
        this.search.set(value);

        localStorage.setItem(
            this.searchKey,
            value,
        );
    }

    setPageSize(
        value: number,
    ): void {
        this.pageSize.set(value);

        localStorage.setItem(
            this.pageSizeKey,
            String(value),
        );
    }
}