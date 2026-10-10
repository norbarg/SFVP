import { CommonModule } from '@angular/common';

import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-pagination',

    standalone: true,

    imports: [
        CommonModule,
    ],

    templateUrl: './pagination.html',
    styleUrl: './pagination.css',
})
export class Pagination {
    @Input() page = 1;

    @Input() perPage = 5;

    @Input() total = 0;

    @Input() firstText =
        'First';

    @Input() prevText =
        'Prev';

    @Input() nextText =
        'Next';

    @Input() lastText =
        'Last';

    @Input() pageText =
        'Page';

    @Input() showText =
        'Show';

    @Output() pageChange =
        new EventEmitter<number>();

    @Output() perPageChange =
        new EventEmitter<number>();

    perPageOptions = [
        5,
        10,
        20,
        50,
        100,
    ];

    get totalPages(): number {
        return Math.max(
            1,
            Math.ceil(
                this.total /
                this.perPage,
            ),
        );
    }

    first(): void {
        this.pageChange.emit(1);
    }

    prev(): void {
        this.pageChange.emit(
            Math.max(
                1,
                this.page - 1,
            ),
        );
    }

    next(): void {
        this.pageChange.emit(
            Math.min(
                this.totalPages,
                this.page + 1,
            ),
        );
    }

    last(): void {
        this.pageChange.emit(
            this.totalPages,
        );
    }

    changePerPage(
        event: Event,
    ): void {
        const select =
            event.target as HTMLSelectElement;

        this.perPageChange.emit(
            Number(
                select.value,
            ),
        );
    }
}