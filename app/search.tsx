import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { locations } from '../data/locations';
import TabBar from '../components/TabBar';
import { useTheme } from '../services/themeService';
import * as LocationService from '../services/locationService';
import * as SearchHistoryService from '../services/searchHistoryService';
import { Location } from '../types/location';
import MapNavigation from '../components/MapNavigation';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { theme } = useTheme();

  // Load recent searches and favorites on mount
  useEffect(() => {
    loadRecentSearches();
    loadFavorites();
  }, []);

  // Update search results when searchText changes
  useEffect(() => {
    if (searchText.trim()) {
      searchLocations(searchText);
    } else {
      setFilteredLocations([]);
    }
  }, [searchText]);

  const loadRecentSearches = async () => {
    try {
      const history = await SearchHistoryService.getSearchHistory();
      // Extract just the search queries
      const searches = history.map(item => item.query).slice(0, 5);
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await LocationService.getFavoriteLocations();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const searchLocations = async (query: string) => {
    setLoading(true);
    try {
      // Search locations
      const results = LocationService.searchLocations(query);
      setFilteredLocations(results);
      
      // Add to search history if not empty query
      if (query.trim()) {
        await SearchHistoryService.addSearchToHistory(query);
        loadRecentSearches();
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      searchLocations(searchText);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchText(query);
    searchLocations(query);
  };

  const toggleFavorite = async (location: Location) => {
    try {
      const isFav = await LocationService.isFavorite(location.id);
      
      if (isFav) {
        // Remove from favorites
        const success = await LocationService.removeFromFavorites(location.id);
        if (success) {
          setFavorites(favorites.filter(id => id !== location.id));
        }
      } else {
        // Add to favorites
        const success = await LocationService.addToFavorites(location.id);
        if (success) {
          setFavorites([...favorites, location.id]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Could not update favorites');
    }
  };

  const isLocationFavorite = (locationId: string) => {
    return favorites.includes(locationId);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCloseMap = () => {
    setSelectedLocation(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Search</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={24} color={theme.text} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search for locations..."
          placeholderTextColor={theme.gray}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!searchText && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={[styles.recentSearchesTitle, { color: theme.text }]}>
            Recent Searches
          </Text>
          <View style={styles.recentSearchItems}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.recentSearchItem, { backgroundColor: theme.lightGray }]}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Ionicons name="time-outline" size={16} color={theme.text} style={styles.recentSearchIcon} />
                <Text style={[styles.recentSearchText, { color: theme.text }]} numberOfLines={1}>
                  {search}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { backgroundColor: theme.card }]}
              onPress={() => handleLocationSelect(item)}
            >
              <View style={styles.resultContent}>
                <Text style={[styles.resultName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.resultCategory, { color: theme.primary }]}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
                <Text
                  style={[styles.resultDescription, { color: theme.text + 'CC' }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                {item.operatingHours && (
                  <Text style={[styles.operatingHours, { color: theme.gray }]}>
                    <Ionicons name="time-outline" size={14} color={theme.gray} /> {item.operatingHours}
                  </Text>
                )}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item)}
                >
                  <Ionicons 
                    name={isLocationFavorite(item.id) ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isLocationFavorite(item.id) ? theme.error : theme.gray} 
                  />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color={theme.primary} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {searchText ? (
                <>
                  <Ionicons
                    name="search-outline"
                    size={64}
                    color={theme.text + '40'}
                  />
                  <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
                    No locations found
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="search-outline"
                    size={64}
                    color={theme.text + '40'}
                  />
                  <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
                    Start typing to search
                  </Text>
                </>
              )}
            </View>
          )}
        />
      )}
      
      <Modal
        visible={!!selectedLocation}
        animationType="slide"
        onRequestClose={handleCloseMap}
      >
        {selectedLocation && (
          <MapNavigation
            destination={selectedLocation}
            onClose={handleCloseMap}
          />
        )}
      </Modal>
      
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  recentSearchesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recentSearchItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  recentSearchIcon: {
    marginRight: 4,
  },
  recentSearchText: {
    fontSize: 14,
    maxWidth: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for TabBar
  },
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCategory: {
    fontSize: 14,
    marginVertical: 4,
  },
  resultDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  operatingHours: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    marginRight: 16,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
}); 