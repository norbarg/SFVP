// react-intro/src/main.jsx

import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from 'react-router-dom';

import App from './App.jsx';
import './styles.css';

const router = createBrowserRouter([
    {
        path: '/routes',
        element: <App />,
    },
    {
        path: '/routes/:id/edit',
        element: <App />,
    },
    {
        path: '/',
        element: <Navigate to="/routes" replace />,
    },
    {
        path: '*',
        element: <Navigate to="/routes" replace />,
    },
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />,
);
