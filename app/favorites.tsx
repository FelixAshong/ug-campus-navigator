import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../services/themeService';
import { Location } from '../types/location';
import * as LocationService from '../services/locationService';
import { locations } from '../data/locations';
import TabBar from '../components/TabBar';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      // Get favorite location IDs
      const favoriteIds = await LocationService.getFavoriteLocations();
      
      // Map IDs to full location objects
      const favoriteLocations = locations.filter(location => 
        favoriteIds.includes(location.id)
      );
      
      setFavorites(favoriteLocations);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Could not load your favorite locations');
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (id: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this location from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await LocationService.removeFromFavorites(id);
              if (success) {
                setFavorites(favorites.filter(item => item.id !== id));
              } else {
                Alert.alert('Error', 'Failed to remove from favorites');
              }
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          },
        },
      ]
    );
  };

  const navigateToLocation = async (location: Location) => {
    try {
      const userLocation = await LocationService.getCurrentLocation();
      const directionsUrl = LocationService.getDirections(
        userLocation.latitude,
        userLocation.longitude,
        location.coordinates.latitude,
        location.coordinates.longitude
      );
      
      // Open Google Maps directions
      const canOpen = await Linking.canOpenURL(directionsUrl);
      if (canOpen) {
        await Linking.openURL(directionsUrl);
      } else {
        Alert.alert('Error', 'Could not open maps application');
      }
    } catch (error) {
      console.error('Error navigating to location:', error);
      Alert.alert('Error', 'Could not get directions to this location');
    }
  };

  const renderFavoriteItem = ({ item }: { item: Location }) => (
    <View style={[styles.favoriteItem, { backgroundColor: theme.card }]}>
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={[styles.favoriteName, { color: theme.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.favoriteCategory, { color: theme.primary }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        <Text style={[styles.favoriteDesc, { color: theme.text }]}>
          {item.description}
        </Text>
        {item.operatingHours && (
          <Text style={[styles.favoriteHours, { color: theme.text + 'CC' }]}>
            <Ionicons name="time-outline" size={14} color={theme.text + 'CC'} /> {item.operatingHours}
          </Text>
        )}
      </View>
      <View style={styles.favoriteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigateToLocation(item)}
        >
          <Ionicons name="navigate" size={24} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <Ionicons name="heart-dislike" size={24} color={theme.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart" size={64} color={theme.text + '40'} />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No favorite locations yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.text + '80' }]}>
            Add locations to your favorites while searching
          </Text>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/')}
          >
            <Ionicons name="search" size={20} color={theme.background} style={styles.searchIcon} />
            <Text style={[styles.searchButtonText, { color: theme.background }]}>Search Locations</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
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
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for TabBar
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteCategory: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoriteDesc: {
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteHours: {
    fontSize: 12,
  },
  favoriteActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
}); 