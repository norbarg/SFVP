import { Suspense } from 'react';

import App from '@/components/App';

export default function RoutesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense
                fallback={<div className="loading">Loading routes...</div>}
            >
                <App />
            </Suspense>

            {children}
        </>
    );
}
