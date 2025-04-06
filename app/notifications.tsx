import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabBar from '../components/TabBar';
import { useTheme } from '../services/themeService';
import * as NotificationService from '../services/notificationService';

// Helper function to format time to relative format (e.g. "2 hours ago")
const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

export default function NotificationsScreen() {
  const { theme, isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
    
    // Create a sample notification for testing
    const createSample = async () => {
      try {
        // Only create a sample if there are no notifications
        const existingNotifications = await NotificationService.getNotifications();
        if (existingNotifications.length === 0) {
          await NotificationService.createSampleNotification();
          loadNotifications(); // Reload notifications after creating sample
        }
      } catch (error) {
        console.error('Error creating sample notification:', error);
        setError('Error creating sample notification');
      }
    };
    
    createSample();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const notificationData = await NotificationService.getNotifications();
      console.log('Loaded notifications:', notificationData);
      setNotifications(notificationData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Update the UI
      setNotifications(
        notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Error marking notification as read');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.deleteNotification(id);
              setNotifications(notifications.filter(notification => notification.id !== id));
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Could not delete notification');
            }
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
      setError('Error marking all as read');
    }
  };

  // For debugging
  const getNotificationCount = () => {
    return `${notifications.length} notifications loaded`;
  };

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
        <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={[styles.markAllButton, { color: theme.primary }]}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Debug information */}
      <View style={[styles.debugInfo, { backgroundColor: isDarkMode ? '#444' : '#eee' }]}>
        <Text style={[styles.debugText, { color: theme.text }]}>
          Theme: {isDarkMode ? 'Dark' : 'Light'} | {getNotificationCount()}
        </Text>
        {error && <Text style={{ color: theme.error }}>{error}</Text>}
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
                  backgroundColor: theme.card,
                  borderLeftColor: item.read ? theme.border : theme.primary,
                  borderLeftWidth: 4,
                }
              ]}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                  {item.title || 'No Title'}
                </Text>
                <Text style={[styles.notificationMessage, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                  {item.message || 'No Message'}
                </Text>
                <Text style={[styles.notificationTime, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                  {item.time ? formatRelativeTime(item.time) : 'Unknown time'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(item.id)}
              >
                <Ionicons name="close-circle" size={22} color={theme.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={[styles.emptyText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            No notifications yet
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={async () => {
              await NotificationService.createSampleNotification();
              loadNotifications();
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Create Sample Notification</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  markAllButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for TabBar
  },
  notificationItem: {
    flexDirection: 'row',
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
  deleteButton: {
    padding: 8,
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
    marginBottom: 20,
  },
  debugInfo: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
}); 