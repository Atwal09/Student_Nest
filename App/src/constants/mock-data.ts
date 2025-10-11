export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  amenities: string[];
  details: {
    type: 'single' | 'shared' | 'apartment';
    furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';
    gender: 'male' | 'female' | 'any';
    totalBeds: number;
    occupiedBeds: number;
  };
  rating?: number;
  reviews?: number;
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Sample room images from Unsplash
const roomImages = [
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  'https://images.unsplash.com/photo-1669071192880-0a94316e6e09',
];

export const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Modern Single Room near Campus',
    description: 'Cozy single room with modern amenities, perfect for students. Walking distance to main campus.',
    price: 12000,
    location: {
      address: 'Green Park Road, Near University',
      city: 'Delhi',
      coordinates: {
        latitude: 28.5621,
        longitude: 77.2841,
      },
    },
    images: [roomImages[0]],
    amenities: ['Wi-Fi', 'AC', 'Study Table', 'Attached Bathroom'],
    details: {
      type: 'single',
      furnishing: 'furnished',
      gender: 'any',
      totalBeds: 1,
      occupiedBeds: 0,
    },
    rating: 4.5,
    reviews: 12,
    owner: {
      id: 'owner1',
      name: 'Rahul Kumar',
      verified: true,
      rating: 4.8,
    },
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Shared 2BHK with Female Roommates',
    description: 'Looking for female roommates in a well-maintained 2BHK. All amenities included.',
    price: 8000,
    location: {
      address: 'Saket, South Delhi',
      city: 'Delhi',
      coordinates: {
        latitude: 28.5244,
        longitude: 77.2167,
      },
    },
    images: [roomImages[1]],
    amenities: ['Wi-Fi', 'AC', 'Kitchen', 'Washing Machine'],
    details: {
      type: 'shared',
      furnishing: 'semi-furnished',
      gender: 'female',
      totalBeds: 3,
      occupiedBeds: 1,
    },
    rating: 4.2,
    reviews: 8,
    owner: {
      id: 'owner2',
      name: 'Priya Singh',
      verified: true,
      rating: 4.6,
    },
    createdAt: '2025-10-02T15:30:00Z',
    updatedAt: '2025-10-02T15:30:00Z',
  },
  {
    id: '3',
    title: 'Premium Studio Apartment',
    description: 'Luxury studio apartment with modern facilities. Perfect for working professionals.',
    price: 25000,
    location: {
      address: 'Cyber City, Gurgaon',
      city: 'Gurgaon',
      coordinates: {
        latitude: 28.4595,
        longitude: 77.0266,
      },
    },
    images: [roomImages[2]],
    amenities: ['Wi-Fi', 'AC', 'Gym', 'Swimming Pool', 'Power Backup'],
    details: {
      type: 'apartment',
      furnishing: 'furnished',
      gender: 'any',
      totalBeds: 1,
      occupiedBeds: 0,
    },
    rating: 4.8,
    reviews: 15,
    owner: {
      id: 'owner3',
      name: 'Arun Mehta',
      verified: true,
      rating: 4.9,
    },
    createdAt: '2025-10-03T09:15:00Z',
    updatedAt: '2025-10-03T09:15:00Z',
  },
  {
    id: '4',
    title: 'Budget Friendly PG for Students',
    description: 'Affordable PG accommodation with basic amenities. Close to metro station.',
    price: 6000,
    location: {
      address: 'Laxmi Nagar, East Delhi',
      city: 'Delhi',
      coordinates: {
        latitude: 28.6314,
        longitude: 77.2785,
      },
    },
    images: [roomImages[3]],
    amenities: ['Wi-Fi', 'Common Kitchen', 'Study Area'],
    details: {
      type: 'shared',
      furnishing: 'semi-furnished',
      gender: 'male',
      totalBeds: 4,
      occupiedBeds: 2,
    },
    rating: 3.9,
    reviews: 6,
    owner: {
      id: 'owner4',
      name: 'Rajesh Gupta',
      verified: false,
      rating: 4.0,
    },
    createdAt: '2025-10-04T12:45:00Z',
    updatedAt: '2025-10-04T12:45:00Z',
  },
];

export const roomFilters = [
  { id: 'all', label: 'All' },
  { id: 'single', label: 'Single Room' },
  { id: 'shared', label: 'Shared Room' },
  { id: 'apartment', label: 'Apartment' },
  { id: 'furnished', label: 'Furnished' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'ac', label: 'AC' },
];