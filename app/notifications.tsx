import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import TabBar from '../components/TabBar';

// Mock data for notifications
const notifications = [
  {
    id: '1',
    title: 'New Event at Great Hall',
    message: 'There is a new event scheduled at the Great Hall tomorrow at 2pm.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Library Hours Updated',
    message: 'Balme Library hours have been extended for exam period.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '3',
    title: 'Campus Map Updated',
    message: 'The campus map has been updated with new locations.',
    time: '3 days ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                { 
                  backgroundColor: colors.card,
                  borderLeftColor: item.read ? colors.border : colors.primary,
                  borderLeftWidth: 4,
                }
              ]}
            >
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.notificationMessage, { color: colors.text + 'CC' }]}>
                  {item.message}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.text + '80' }]}>
                  {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={colors.text + '40'} />
          <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
            No notifications yet
          </Text>
        </View>
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
  },
  notificationItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
}); 