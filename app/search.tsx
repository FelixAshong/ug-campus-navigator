import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { locations } from '../data/locations';
import TabBar from '../components/TabBar';

// Mock data for all locations
const allLocations = [
  {
    id: '1',
    name: 'Balme Library',
    description: 'Main University Library',
    category: 'Library',
    operatingHours: 'Mon-Fri: 8am-10pm, Sat: 9am-5pm',
  },
  {
    id: '2',
    name: 'Great Hall',
    description: 'Main Auditorium',
    category: 'Event Venue',
    operatingHours: '24/7',
  },
  {
    id: '3',
    name: 'Department of Computer Science',
    description: 'Computer Science Department',
    category: 'Academic',
    operatingHours: 'Mon-Fri: 8am-5pm',
  },
  {
    id: '4',
    name: 'Legon Hall',
    description: 'Student Residence',
    category: 'Hostel',
    operatingHours: '24/7',
  },
  {
    id: '5',
    name: 'Commonwealth Hall',
    description: 'Student Residence',
    category: 'Hostel',
    operatingHours: '24/7',
  },
];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const { colors } = useTheme();

  const filteredLocations = searchText
    ? locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchText.toLowerCase()) ||
          location.description.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={24} color={colors.text} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search for locations..."
          placeholderTextColor={colors.text + '80'}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultItem, { backgroundColor: colors.card }]}
          >
            <View style={styles.resultContent}>
              <Text style={[styles.resultName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.resultCategory, { color: colors.primary }]}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Text>
              <Text
                style={[styles.resultDescription, { color: colors.text + 'CC' }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {searchText ? (
              <>
                <Ionicons
                  name="search-outline"
                  size={64}
                  color={colors.text + '40'}
                />
                <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
                  No locations found
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="search-outline"
                  size={64}
                  color={colors.text + '40'}
                />
                <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
                  Start typing to search
                </Text>
              </>
            )}
          </View>
        )}
      />
      
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
  listContainer: {
    padding: 16,
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