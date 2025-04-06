import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { locations } from '../data/locations';
import TabBar from '../components/TabBar';
import { useTheme } from '../services/themeService';

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const filteredLocations = selectedCategory
    ? locations.filter((location) => location.category === selectedCategory)
    : locations;

  const categories: Category[] = [
    { id: 'academic', name: 'Academic', icon: 'school-outline' },
    { id: 'residence', name: 'Residence', icon: 'home-outline' },
    { id: 'administrative', name: 'Admin', icon: 'business-outline' },
    { id: 'sports', name: 'Sports', icon: 'basketball-outline' },
    { id: 'dining', name: 'Dining', icon: 'restaurant-outline' },
    { id: 'health', name: 'Health', icon: 'medkit-outline' },
    { id: 'other', name: 'Other', icon: 'grid-outline' },
    { id: 'campus', name: 'Campus', icon: 'map-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.background }]}>
          UG Campus Navigator
        </Text>
        <View style={styles.themeSwitchContainer}>
          <Ionicons name="sunny" size={20} color={theme.background} style={styles.themeIcon} />
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#f4f3f4', true: theme.accent + '80' }}
            thumbColor={isDarkMode ? theme.accent : '#f4f3f4'}
          />
          <Ionicons name="moon" size={20} color={theme.background} style={styles.themeIcon} />
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 5.6502,
          longitude: -0.1864,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      <View style={[styles.categoriesContainer, { backgroundColor: theme.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? theme.primary
                      : theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
            >
              <Ionicons
                name={category.icon}
                size={24}
                color={
                  selectedCategory === category.id
                    ? theme.background
                    : theme.text
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.id
                        ? theme.background
                        : theme.text,
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.featuredContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Featured Locations
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredLocations.slice(0, 5).map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[styles.locationCard, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <Ionicons name="location" size={24} color={theme.primary} />
              <Text style={[styles.locationName, { color: theme.text }]}>
                {location.name}
              </Text>
              <Text style={[styles.locationDesc, { color: theme.text + 'CC' }]}>
                {location.description.length > 60 
                  ? location.description.substring(0, 60) + '...'
                  : location.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginHorizontal: 5,
  },
  map: {
    flex: 1,
  },
  categoriesContainer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  featuredContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationCard: {
    width: 200,
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  locationDesc: {
    fontSize: 14,
    marginTop: 4,
  },
}); 