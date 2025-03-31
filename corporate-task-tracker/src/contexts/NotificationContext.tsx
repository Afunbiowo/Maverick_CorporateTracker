import React, { createContext, useContext, useEffect, useState } from 'react';
import { messaging } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { toast, ToastContainer } from 'react/toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTasks } from './TaskContext';

interface NotificationContextType {
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { tasks } = useTasks();

  useEffect(() => {
    if (!messaging) return;

    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          const token = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY',
          });
          console.log('FCM token:', token);
          
          // Here you would typically send this token to your backend
          // to associate it with the user for targeted notifications
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      toast.info(payload.notification?.body || 'New notification');
    });

    return () => unsubscribe();
  }, []);

  // Check for completed tasks and notify
  useEffect(() => {
    const completedTasks = tasks.filter(task => 
      task.status === 'Completed' && 
      task.completedAt && 
      new Date(task.completedAt).getTime() > Date.now() - 60000 // Completed in the last minute
    );

    completedTasks.forEach(task => {
      const duration = task.completedAt && task.createdAt
        ? Math.round((new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        : null;

      toast.success(
        `Task "${task.title}" completed! ${duration ? `(Took ${duration.toFixed(1)} days)` : ''}`,
        { autoClose: 5000 }
      );
    });
  }, [tasks]);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        const token = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY',
        });
        console.log('FCM token:', token);
        return token;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ requestPermission }}>
      {children}
      <ToastContainer position="bottom-right" />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}