import { Routes } from '@angular/router';

import {
    Routes as RoutesPage,
    canDeactivateEdit,
} from './pages/routes/routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'routes',
        pathMatch: 'full',
    },

    {
        path: 'routes',
        component: RoutesPage,
    },

    {
        path: 'routes/:id/edit',
        component: RoutesPage,

        canDeactivate: [
            canDeactivateEdit,
        ],
    },

    {
        path: '**',
        redirectTo: 'routes',
    },
];