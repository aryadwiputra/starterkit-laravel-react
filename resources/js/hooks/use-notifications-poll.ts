import { useEffect, useRef, useState } from 'react';
import { poll as notificationsPoll } from '@/routes/notifications';

type LatestNotification = {
    id: string;
    read_at: string | null;
    created_at: string | null;
    title: string | null;
    body: string | null;
    url: string | null;
    type: string;
};

type PollResponse = {
    unread_count: number;
    latest: LatestNotification[];
};

const POLL_INTERVAL_MS = 20_000;

export function useNotificationsPoll() {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [latest, setLatest] = useState<LatestNotification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchOnce() {
            try {
                const response = await fetch(notificationsPoll().url, {
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    return;
                }

                const json = (await response.json()) as PollResponse;

                if (cancelled) {
                    return;
                }

                setUnreadCount(json.unread_count ?? 0);
                setLatest(Array.isArray(json.latest) ? json.latest : []);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        function start() {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }

            intervalRef.current = window.setInterval(() => {
                if (document.visibilityState === 'visible') {
                    void fetchOnce();
                }
            }, POLL_INTERVAL_MS);
        }

        void fetchOnce();
        start();

        function onVisibilityChange() {
            if (document.visibilityState === 'visible') {
                void fetchOnce();
            }
        }

        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            cancelled = true;
            document.removeEventListener(
                'visibilitychange',
                onVisibilityChange,
            );

            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { unreadCount, latest, loading };
}

