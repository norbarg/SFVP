import { CommonModule } from '@angular/common';

import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-modal',

    standalone: true,

    imports: [
        CommonModule,
    ],

    templateUrl: './modal.html',
    styleUrl: './modal.css',
})
export class Modal {
    @Input() open = false;

    @Input() title = '';

    @Input() confirmText =
        'Confirm';

    @Input() cancelText =
        'Cancel';

    @Output() close =
        new EventEmitter<void>();

    @Output() confirm =
        new EventEmitter<void>();

    closeOnBackdrop(
        event: MouseEvent,
    ): void {
        if (
            event.target ===
            event.currentTarget
        ) {
            this.close.emit();
        }
    }
}