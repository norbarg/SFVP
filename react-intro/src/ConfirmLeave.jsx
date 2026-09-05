import { useEffect } from 'react';

export default function ConfirmLeave({ enabled }) {
    useEffect(() => {
        if (!enabled) return;

        const handler = (event) => {
            event.preventDefault();
            event.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', handler);

        return () => {
            window.removeEventListener('beforeunload', handler);
        };
    }, [enabled]);

    return null;
}
