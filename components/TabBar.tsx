import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useRouter, usePathname } from 'expo-router';

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
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
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
              color={isActive ? colors.primary : colors.text}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? colors.primary : colors.text },
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
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
}); 