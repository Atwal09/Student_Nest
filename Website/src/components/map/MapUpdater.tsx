'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapUpdaterProps {
  rooms: Array<{
    location?: {
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  }>;
  userLocation?: {
    lat: number;
    lng: number;
  };
}

export function MapUpdater({ rooms, userLocation }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const bounds = L.latLngBounds([]);
    let hasPoints = false;

    // Add user location to bounds
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
      hasPoints = true;
    }

    // Add all room locations to bounds
    rooms.forEach((room) => {
      if (room.location?.coordinates) {
        bounds.extend([
          room.location.coordinates.lat,
          room.location.coordinates.lng,
        ]);
        hasPoints = true;
      }
    });

    // Fit map to bounds if we have any points
    if (hasPoints) {
      // Use setTimeout to ensure map is fully initialized
      setTimeout(() => {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: true,
        });
      }, 100);
    }
  }, [map, rooms, userLocation]);

  return null;
}
