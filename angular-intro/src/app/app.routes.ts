import { Routes } from '@angular/router';

import { Routes as RoutesPage } from './pages/routes/routes';

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
    },

    {
        path: '**',
        redirectTo: 'routes',
    },
];