import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { LatLngTuple } from '../../types';

export function MapUpdater({ center }: { center: LatLngTuple }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, 13);
    }, [center, map]);

    return null;
}

export function MapResizer() {
    const map = useMap();
    const resizeObserver = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        const container = map.getContainer();
        resizeObserver.current = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.current.observe(container);

        return () => {
            clearTimeout(timer);
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
        };
    }, [map]);

    return null;
}