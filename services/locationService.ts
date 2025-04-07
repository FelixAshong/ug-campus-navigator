import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location as LocationType } from '../types/location';
import { locations } from '../data/locations';
import * as ExpoLocation from 'expo-location';

// Favorite locations functionality
const FAVORITES_STORAGE_KEY = 'ug_campus_navigator_favorites';

export type TransportationMode = 'walking' | 'driving' | 'bicycling' | 'transit';

export async function getFavoriteLocations(): Promise<string[]> {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export async function addToFavorites(locationId: string): Promise<boolean> {
  try {
    const favorites = await getFavoriteLocations();
    if (!favorites.includes(locationId)) {
      favorites.push(locationId);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
}

export async function removeFromFavorites(locationId: string): Promise<boolean> {
  try {
    const favorites = await getFavoriteLocations();
    const newFavorites = favorites.filter(id => id !== locationId);
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
}

export async function isFavorite(locationId: string): Promise<boolean> {
  try {
    const favorites = await getFavoriteLocations();
    return favorites.includes(locationId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

// User location functionality
export async function getCurrentLocation() {
  try {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }
    
    const location = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      heading: location.coords.heading,
      speed: location.coords.speed,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    // Return a default location (UG campus center)
    return {
      latitude: 5.6502,
      longitude: -0.1864,
      accuracy: 0,
      altitude: 0,
      heading: 0,
      speed: 0,
    };
  }
}

// Search functionality
export function searchLocations(query: string) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm) ||
    location.description.toLowerCase().includes(searchTerm) ||
    location.category.toLowerCase().includes(searchTerm)
  );
}

// Get directions with transportation mode
export async function getDirections(
  fromLat: number, 
  fromLng: number, 
  toLat: number, 
  toLng: number,
  mode: TransportationMode = 'walking'
) {
  // Get API key from app config
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key is not configured');
    return null;
  }

  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  
  try {
    const response = await fetch(
      `${baseUrl}?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&mode=${mode}&key=${apiKey}&alternatives=true&departure_time=now&traffic_model=best_guess`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      const route = data.routes[0];
      const points = route.overview_polyline.points;
      const steps = route.legs[0].steps.map((step: any) => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text,
        startLocation: step.start_location,
        endLocation: step.end_location,
      }));
      
      // Get traffic information if available
      const durationInTraffic = route.legs[0].duration_in_traffic?.text;
      
      return {
        points,
        steps,
        distance: route.legs[0].distance.text,
        duration: durationInTraffic || route.legs[0].duration.text,
        hasTraffic: !!durationInTraffic,
      };
    } else if (data.status === 'REQUEST_DENIED') {
      console.error('Google Maps API request denied. Please check your API key configuration.');
      return null;
    } else if (data.status === 'ZERO_RESULTS') {
      console.warn('No route found between the specified locations');
      return null;
    } else {
      console.error('Google Maps API error:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Error getting directions:', error);
    return null;
  }
}

// Helper function to encode a simple polyline
function encodePolyline(points: { lat: number; lng: number }[]): string {
  let encoded = '';
  let lastLat = 0;
  let lastLng = 0;

  for (const point of points) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);
    
    const dLat = lat - lastLat;
    const dLng = lng - lastLng;
    
    encoded += encodeNumber(dLat) + encodeNumber(dLng);
    
    lastLat = lat;
    lastLng = lng;
  }
  
  return encoded;
}

function encodeNumber(num: number): string {
  let encoded = '';
  num = num < 0 ? ~(num << 1) : num << 1;
  
  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  
  encoded += String.fromCharCode(num + 63);
  return encoded;
}

// Get nearby locations
export function getNearbyLocations(latitude: number, longitude: number, maxDistance: number = 0.5) {
  return locations.filter(location => {
    const distance = calculateDistance(
      latitude, 
      longitude,
      location.coordinates.latitude,
      location.coordinates.longitude
    );
    return distance <= maxDistance;
  });
}

// Helper function to calculate distance between two points in km using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
} 