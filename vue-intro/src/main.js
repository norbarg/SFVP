import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import './style.css';

const routes = [
    {
        path: '/',
        redirect: '/routes',
    },
    {
        path: '/routes',
        name: 'routes',
        component: App,
    },
    {
        path: '/routes/:id/edit',
        name: 'route-edit',
        component: App,
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/routes',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app');
