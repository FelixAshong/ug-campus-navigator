import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key
const NOTIFICATIONS_STORAGE_KEY = 'ug_campus_navigator_notifications';

// Notification types
export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string; // ISO string or formatted time
  read: boolean;
};

// Initialize notifications
export async function initNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Permission not granted for notifications');
    return false;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00693E',
    });
  }
  
  return true;
}

// Schedule a notification
export async function scheduleNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

// Get all stored notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const notificationsJson = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return notificationsJson ? JSON.parse(notificationsJson) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

// Save a new notification to storage
export async function saveNotification(notification: Notification): Promise<boolean> {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = [notification, ...notifications];
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Error saving notification:', error);
    return false;
  }
}

// Mark a notification as read
export async function markAsRead(notificationId: string): Promise<boolean> {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<boolean> {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<boolean> {
  try {
    const notifications = await getNotifications();
    const updatedNotifications = notifications.map(notification => ({ 
      ...notification, 
      read: true 
    }));
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
}

// Get unread notifications count
export async function getUnreadCount(): Promise<number> {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => !notification.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

// Create a sample notification for testing
export async function createSampleNotification(
  title: string = 'Welcome to UG Campus Navigator', 
  message: string = 'Explore the University of Ghana campus with ease. Find locations, get directions, and discover campus events.'
): Promise<boolean> {
  const newNotification: Notification = {
    id: Date.now().toString(),
    title,
    message,
    time: new Date().toISOString(),
    read: false,
  };
  
  return await saveNotification(newNotification);
} 