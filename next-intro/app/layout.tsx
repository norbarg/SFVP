import type { Metadata } from 'next';

import './globals.css';

import Providers from '@/components/Providers';

export const metadata: Metadata = {
    title: 'ATLAS',
    description: 'Travel routes CRUD application on Next.js',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
