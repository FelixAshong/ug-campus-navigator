export default {
  name: 'ug-campus-navigator',
  slug: 'ug-campus-navigator',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#003366' // University of Ghana blue
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*',
    'assets/images/**/*',
    'assets/**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ug.campusnavigator',
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'This app needs access to your location to provide navigation services.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'This app needs access to your location to provide navigation services.',
      UIBackgroundModes: ['location']
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.ug.campusnavigator',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    },
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION'
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow UG Campus Navigator to use your location.'
      }
    ]
  ],
  extra: {
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    eas: {
      projectId: "your-project-id"
    }
  },
  scheme: "ug-campus-navigator",
  newArchEnabled: true,
  experiments: {
    typedRoutes: true
  }
}; 