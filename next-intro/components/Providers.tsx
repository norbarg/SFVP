'use client';

import type { ReactNode } from 'react';

import { SettingsProvider } from './SettingsContext';

export default function Providers({ children }: { children: ReactNode }) {
    return <SettingsProvider>{children}</SettingsProvider>;
}
