import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface Location {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Mock data for favorites
const initialFavorites: Location[] = [
  {
    id: '1',
    name: 'Balme Library',
    description: 'Main University Library',
    category: 'Library',
  },
  {
    id: '2',
    name: 'Department of Computer Science',
    description: 'Computer Science Department',
    category: 'Academic',
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Location[]>(initialFavorites);
  const { colors } = useTheme();

  const removeFromFavorites = (id: string) => {
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
          onPress: () => {
            setFavorites(favorites.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: Location }) => (
    <View style={[styles.favoriteItem, { backgroundColor: colors.card }]}>
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <Text style={[styles.favoriteName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.favoriteCategory, { color: colors.primary }]}>
            {item.category}
          </Text>
        </View>
        <Text style={[styles.favoriteDesc, { color: colors.text }]}>
          {item.description}
        </Text>
      </View>
      <View style={styles.favoriteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Navigate to location details
          }}
        >
          <Ionicons name="navigate" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeFromFavorites(item.id)}
        >
          <Ionicons name="trash" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart" size={64} color={colors.text + '40'} />
          <Text style={[styles.emptyStateText, { color: colors.text }]}>
            No favorite locations yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.text + '80' }]}>
            Add locations to your favorites to see them here
          </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  },
  favoriteCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  favoriteDesc: {
    fontSize: 14,
  },
  favoriteActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
}); 