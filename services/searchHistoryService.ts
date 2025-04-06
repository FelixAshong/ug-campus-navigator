import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationType } from '../types/location';

// Storage key
const SEARCH_HISTORY_KEY = 'ug_campus_navigator_search_history';
const RECENT_SEARCHES_LIMIT = 20;

// Type definitions
export type SearchHistoryItem = {
  id: string;
  query: string;
  timestamp: number;
  locationSelected?: LocationType;
};

/**
 * Get all search history items
 * @returns Promise resolving to array of search history items
 */
export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
}

/**
 * Add a new search query to history
 * @param query The search query string
 * @returns Promise resolving to the updated history array
 */
export async function addSearchToHistory(query: string): Promise<SearchHistoryItem[]> {
  try {
    const history = await getSearchHistory();
    
    // Create new history item
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
    };
    
    // Remove duplicate queries (keep the most recent)
    const filteredHistory = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // Add new item to the beginning
    const updatedHistory = [newItem, ...filteredHistory].slice(0, RECENT_SEARCHES_LIMIT);
    
    // Save to storage
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    return updatedHistory;
  } catch (error) {
    console.error('Error adding search to history:', error);
    return [];
  }
}

/**
 * Update a search history item with selected location
 * @param searchId ID of the search history item to update
 * @param location The location that was selected
 * @returns Promise resolving to boolean indicating success
 */
export async function updateSearchWithLocation(
  searchId: string, 
  location: LocationType
): Promise<boolean> {
  try {
    const history = await getSearchHistory();
    const updatedHistory = history.map(item => {
      if (item.id === searchId) {
        return { ...item, locationSelected: location };
      }
      return item;
    });
    
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error updating search with location:', error);
    return false;
  }
}

/**
 * Delete a specific search history item
 * @param searchId ID of the search to delete
 * @returns Promise resolving to boolean indicating success
 */
export async function deleteSearchHistoryItem(searchId: string): Promise<boolean> {
  try {
    const history = await getSearchHistory();
    const updatedHistory = history.filter(item => item.id !== searchId);
    
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting search history item:', error);
    return false;
  }
}

/**
 * Clear all search history
 * @returns Promise resolving to boolean indicating success
 */
export async function clearSearchHistory(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing search history:', error);
    return false;
  }
}

/**
 * Get frequently searched locations
 * @param limit Maximum number of items to return
 * @returns Promise resolving to array of most frequently searched locations with counts
 */
export async function getFrequentSearches(limit = 5): Promise<{location: LocationType, count: number}[]> {
  try {
    const history = await getSearchHistory();
    
    // Only include items with selected locations
    const searchesWithLocations = history.filter(item => item.locationSelected);
    
    // Count occurrences of each location
    const locationCounts = new Map<string, {location: LocationType, count: number}>();
    
    searchesWithLocations.forEach(item => {
      if (item.locationSelected) {
        const locationId = item.locationSelected.id;
        
        if (locationCounts.has(locationId)) {
          const current = locationCounts.get(locationId)!;
          locationCounts.set(locationId, {
            location: item.locationSelected,
            count: current.count + 1
          });
        } else {
          locationCounts.set(locationId, {
            location: item.locationSelected,
            count: 1
          });
        }
      }
    });
    
    // Convert to array and sort by count (descending)
    return Array.from(locationCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
  } catch (error) {
    console.error('Error getting frequent searches:', error);
    return [];
  }
} 