import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../services/themeService';

type Route = {
  name: string;
  path: '/' | '/search' | '/favorites' | '/notifications' | '/profile';
  icon: keyof typeof Ionicons.glyphMap;
};

const routes: Route[] = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Search', path: '/search', icon: 'search' },
  { name: 'Favorites', path: '/favorites', icon: 'heart' },
  { name: 'Notifications', path: '/notifications', icon: 'notifications' },
  { name: 'Profile', path: '/profile', icon: 'person' },
];

export default function TabBar() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      {routes.map((route) => {
        const isActive = 
          route.path === '/' 
            ? pathname === '/' || pathname === '/index'
            : pathname === route.path;
            
        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabButton}
            onPress={() => router.push(route.path)}
          >
            <Ionicons
              name={route.icon}
              size={24}
              color={isActive ? theme.primary : theme.gray}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.primary : theme.gray },
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
}); 