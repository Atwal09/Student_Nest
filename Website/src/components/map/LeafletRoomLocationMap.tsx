'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, MapPin, Navigation2, } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

interface Location {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  city: string;
}

interface LeafletRoomLocationMapProps {
  location: Location;
  title?: string;
  height?: string;
  showCircle?: boolean;
  circleRadius?: number; // in meters
}

export function LeafletRoomLocationMap({
  location,
  title = 'Room Location',
  height = '400px',
  showCircle = true,
  circleRadius = 200,
}: LeafletRoomLocationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!location?.coordinates) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-red-300"
        style={{ height }}
      >
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Location not available
          </p>
        </div>
      </div>
    );
  }

  const center: [number, number] = [
    location.coordinates.lat,
    location.coordinates.lng,
  ];

  return (
    <div className="space-y-4">
      {/* Map */}
      <div style={{ height }} className="rounded-lg overflow-hidden border relative z-0">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Room Marker */}
          <Marker position={center}>
            <Popup>
              <div className="text-center p-1">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-gray-600 mt-1">{location.city}</p>
              </div>
            </Popup>
          </Marker>

          {/* Approximate area circle */}
          {showCircle && (
            <Circle
              center={center}
              radius={circleRadius}
              pathOptions={{
                color: 'rgb(59, 130, 246)',
                fillColor: 'rgb(59, 130, 246)',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Location Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                {location.address}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {location.city}
                </Badge>
                <span className="text-xs text-gray-500">
                  {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
