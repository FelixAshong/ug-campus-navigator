import React, { useEffect, useState, forwardRef, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform, Text, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as LocationService from '../services/locationService';
import { Location } from '../types/location';
import { useTheme } from '../services/themeService';
import { decode } from '@mapbox/polyline';

interface MapNavigationProps {
  destination: Location;
  onClose: () => void;
}

const MapNavigation = forwardRef<MapView, MapNavigationProps>(({ destination, onClose }, ref) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [transportationMode, setTransportationMode] = useState<LocationService.TransportationMode>('walking');
  const [routeInfo, setRouteInfo] = useState<{ 
    distance: string; 
    duration: string;
    hasTraffic?: boolean;
  } | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      loadRoute();
    }
  }, [currentLocation, transportationMode]);

  useEffect(() => {
    if (mapRef.current && destination) {
      mapRef.current.animateToRegion({
        latitude: destination.coordinates.latitude,
        longitude: destination.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [destination]);

  const loadCurrentLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (error) {
      console.error('Error loading current location:', error);
      Alert.alert(
        'Location Error',
        'Could not get your current location. Using default location instead.',
        [{ text: 'OK' }]
      );
    }
  };

  const loadRoute = async () => {
    if (!currentLocation) return;

    try {
      const directions = await LocationService.getDirections(
        currentLocation.latitude,
        currentLocation.longitude,
        destination.coordinates.latitude,
        destination.coordinates.longitude,
        transportationMode
      );

      if (directions) {
        const points = decode(directions.points);
        const coordinates = points.map((point: [number, number]) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoordinates(coordinates);
        setRouteInfo({
          distance: directions.distance,
          duration: directions.duration,
          hasTraffic: directions.hasTraffic,
        });
        setIsUsingFallback(false);
      } else {
        Alert.alert(
          'Route Error',
          'Could not find a route to the destination. Please try a different location or transportation mode.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error loading route:', error);
      Alert.alert(
        'Route Error',
        'Could not load the route. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleTransportationMode = () => {
    const modes: LocationService.TransportationMode[] = ['walking', 'driving', 'bicycling', 'transit'];
    const currentIndex = modes.indexOf(transportationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTransportationMode(modes[nextIndex]);
  };

  const toggleMapType = () => {
    const types: ('standard' | 'satellite' | 'hybrid')[] = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  if (!currentLocation) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: destination.coordinates.latitude,
          longitude: destination.coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        showsTraffic
        pitchEnabled
        rotateEnabled
        showsBuildings
        showsIndoors
        showsIndoorLevelPicker
        showsPointsOfInterest
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor={theme.primary}
        >
          <View style={styles.currentLocationMarker}>
            <View style={[styles.currentLocationPulse, { backgroundColor: theme.primary }]} />
            <View style={[styles.currentLocationDot, { backgroundColor: theme.primary }]} />
          </View>
        </Marker>

        {/* Destination Marker */}
        <Marker
          coordinate={{
            latitude: destination.coordinates.latitude,
            longitude: destination.coordinates.longitude,
          }}
          title={destination.name}
          description={destination.description}
          pinColor={theme.error}
        >
          <View style={styles.destinationMarker}>
            <Ionicons name="location" size={24} color={theme.error} />
          </View>
        </Marker>

        {/* Navigation Path */}
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor={isUsingFallback ? theme.gray : theme.primary}
        />
      </MapView>

      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        {/* Map Type Toggle */}
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: theme.card }]}
          onPress={toggleMapType}
        >
          <Ionicons 
            name={mapType === 'standard' ? 'map' : mapType === 'satellite' ? 'globe' : 'layers'} 
            size={24} 
            color={theme.primary} 
          />
        </TouchableOpacity>

        {/* Transportation Mode Button */}
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: theme.card }]}
          onPress={toggleTransportationMode}
        >
          <Ionicons 
            name={getTransportIcon(transportationMode) as any} 
            size={24} 
            color={theme.primary} 
          />
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: theme.card }]}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Route Info */}
      {routeInfo && (
        <View style={[styles.routeInfo, { backgroundColor: theme.card }]}>
          <Text style={[styles.routeText, { color: theme.text }]}>
            {routeInfo.distance} • {routeInfo.duration}
            {routeInfo.hasTraffic && ' (with traffic)'}
          </Text>
        </View>
      )}
    </View>
  );
});

const getTransportIcon = (mode: LocationService.TransportationMode): string => {
  switch (mode) {
    case 'walking':
      return 'walk';
    case 'driving':
      return 'car';
    case 'bicycling':
      return 'bicycle';
    case 'transit':
      return 'bus';
    default:
      return 'walk';
  }
};

MapNavigation.displayName = 'MapNavigation';

export default MapNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  controlsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.3,
  },
  currentLocationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  destinationMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 