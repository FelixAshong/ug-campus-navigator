import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location as LocationType } from '../types/location';
import { locations } from '../data/locations';
import * as ExpoLocation from 'expo-location';

// Favorite locations functionality
const FAVORITES_STORAGE_KEY = 'ug_campus_navigator_favorites';

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
      accuracy: ExpoLocation.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    // Return a default location (UG campus center)
    return {
      latitude: 5.6502,
      longitude: -0.1864,
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

// Get directions
export function getDirections(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  // Return URL for Google Maps directions
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=walking`;
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