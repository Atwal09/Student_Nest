/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter rooms by distance from a location
 * @param rooms Array of rooms
 * @param userLocation User's location coordinates
 * @param radiusKm Maximum distance in kilometers
 * @returns Filtered rooms within radius
 */
export function filterRoomsByDistance<T extends {
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}>(
  rooms: T[],
  userLocation: { lat: number; lng: number },
  radiusKm: number
): T[] {
  return rooms.filter((room) => {
    if (!room.location?.coordinates) return false;

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      room.location.coordinates.lat,
      room.location.coordinates.lng
    );

    return distance <= radiusKm;
  });
}

/**
 * Sort rooms by distance from a location
 * @param rooms Array of rooms
 * @param userLocation User's location coordinates
 * @returns Rooms sorted by distance (nearest first)
 */
export function sortRoomsByDistance<T extends {
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}>(
  rooms: T[],
  userLocation: { lat: number; lng: number }
): Array<T & { distance: number }> {
  return rooms
    .map((room) => {
      const distance = room.location?.coordinates
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            room.location.coordinates.lat,
            room.location.coordinates.lng
          )
        : Infinity;

      return { ...room, distance };
    })
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted string (e.g., "2.5 km" or "500 m")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}
