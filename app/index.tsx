import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch, Image, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { locations } from '../data/locations';
import TabBar from '../components/TabBar';
import { useTheme } from '../services/themeService';
import * as Location from 'expo-location';

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type QuickAction = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Mock data for events
  const events: Event[] = [
    {
      id: '1',
      title: 'Career Fair 2024',
      date: '2024-04-15',
      location: 'Great Hall',
      description: 'Annual career fair featuring top companies',
    },
    {
      id: '2',
      title: 'Sports Day',
      date: '2024-04-20',
      location: 'Sports Complex',
      description: 'Annual inter-faculty sports competition',
    },
  ];

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'emergency',
      name: 'Emergency',
      icon: 'warning',
      action: () => Linking.openURL('tel:112'),
    },
    {
      id: 'shuttle',
      name: 'Shuttle',
      icon: 'bus',
      action: () => {},
    },
    {
      id: 'library',
      name: 'Library',
      icon: 'library',
      action: () => {},
    },
    {
      id: 'cafeteria',
      name: 'Cafeteria',
      icon: 'restaurant',
      action: () => {},
    },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

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

      <ScrollView style={styles.scrollView}>
        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionButton, { backgroundColor: theme.background }]}
                onPress={action.action}
              >
                <Ionicons name={action.icon} size={24} color={theme.primary} />
                <Text style={[styles.quickActionText, { color: theme.text }]}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Map Section */}
        <View style={[styles.mapContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Campus Map</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 5.6502,
              longitude: -0.1864,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                title="Your Location"
                pinColor={theme.primary}
              />
            )}
          </MapView>
        </View>

        {/* Categories */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
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

        {/* Featured Locations */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
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

        {/* Campus Events */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Events</Text>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <View style={styles.eventHeader}>
                <Ionicons name="calendar" size={20} color={theme.primary} />
                <Text style={[styles.eventDate, { color: theme.text }]}>{event.date}</Text>
              </View>
              <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
              <Text style={[styles.eventLocation, { color: theme.text + 'CC' }]}>
                <Ionicons name="location" size={16} color={theme.text + 'CC'} /> {event.location}
              </Text>
              <Text style={[styles.eventDescription, { color: theme.text + 'CC' }]}>
                {event.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '23%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 12,
  },
  map: {
    flex: 1,
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
  eventCard: {
    padding: 16,
    marginBottom: 12,
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
  },
}); 