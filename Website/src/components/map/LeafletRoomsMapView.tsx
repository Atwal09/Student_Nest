'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Home, IndianRupee, Bed, Star, Navigation2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

const defaultCenter: [number, number] = [28.6139, 77.2090]; // Delhi

interface Room {
  _id: string;
  title: string;
  price: number;
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
    city: string;
  };
  images: string[];
  roomType: string;
  accommodationType: string;
  rating?: number;
  availability?: {
    isAvailable: boolean;
  };
}

interface LeafletRoomsMapViewProps {
  rooms: Room[];
  userLocation?: {
    lat: number;
    lng: number;
  };
  height?: string;
  showRadius?: boolean;
  radiusKm?: number;
}

export function LeafletRoomsMapView({ 
  rooms, 
  userLocation, 
  height = '600px',
  showRadius = false,
  radiusKm = 5
}: LeafletRoomsMapViewProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [center, setCenter] = useState<[number, number]>(
    userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter
  );

  useEffect(() => {
    setMounted(true);
    
    // Set center based on rooms or user location
    if (rooms.length > 0 && !userLocation) {
      const firstRoom = rooms[0];
      if (firstRoom.location?.coordinates) {
        setCenter([
          firstRoom.location.coordinates.lat,
          firstRoom.location.coordinates.lng,
        ]);
      }
    } else if (userLocation) {
      setCenter([userLocation.lat, userLocation.lng]);
    }
  }, [rooms, userLocation]);

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

  const handleRoomClick = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border relative z-0">
      <MapContainer
        center={center}
        zoom={userLocation ? 13 : 11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker with radius */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="text-center">
                  <Navigation2 className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="font-semibold">Your Location</p>
                </div>
              </Popup>
            </Marker>
            
            {showRadius && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000} // Convert km to meters
                pathOptions={{
                  color: 'rgb(59, 130, 246)',
                  fillColor: 'rgb(59, 130, 246)',
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            )}
          </>
        )}

        {/* Room markers */}
        {rooms.map((room) => {
          if (!room.location?.coordinates) return null;

          return (
            <Marker
              key={room._id}
              position={[
                room.location.coordinates.lat,
                room.location.coordinates.lng,
              ]}
            >
              <Popup maxWidth={300} minWidth={250}>
                <div className="p-2">
                  {/* Room Image */}
                  {room.images && room.images.length > 0 && (
                    <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={room.images[0]}
                        alt={room.title}
                        fill
                        className="object-cover"
                        sizes="250px"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Room Info */}
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {room.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {room.location.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        <Home className="w-3 h-3 mr-1" />
                        {room.roomType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Bed className="w-3 h-3 mr-1" />
                        {room.accommodationType}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        <span className="font-bold">
                          {room.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600">/month</span>
                      </div>

                      {room.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">
                            {room.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleRoomClick(room._id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Card className="shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">
                {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'} Found
              </span>
            </div>
            {showRadius && (
              <p className="text-xs text-gray-600 mt-1">
                Within {radiusKm} km radius
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
