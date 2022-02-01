/* eslint-disable function-paren-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import { Alert, Platform, Text } from 'react-native';
import { barcodeContext, cameraContext, itemContext } from './context';
import Camera from './components/Camera';
import AddItemFormik from './components/AddItemFormik';
import Home from './components/Home';
import FridgeNavigator from './navigation/FridgeNavigator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Tab = createBottomTabNavigator();

function MyTabs({ barcodeData }) {
  return (
    <Tab.Navigator
      initialRouteName="Fridge"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Fridge"
        component={FridgeNavigator}
        options={{
          tabBarLabel: 'Your fridge',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fridge" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Add Item"
        component={AddItemFormik}
        options={{
          tabBarLabel: 'Add Item',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={Home}
        options={{
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="reader" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const prefix = Linking.createURL('fridge/');

const config = {
  screens: {
    Fridge: 'list',
    Recipes: 'a',
  },
};

export default function App() {
  const linking = {
    prefixes: [prefix],
    config,
  };

  const foodArray = [
    { name: 'pear', expiry_date: 'Thu Jan 26' },
    { name: 'apple', expiry_date: 'Thu Jan 27' },
    { name: 'kiwi', expiry_date: 'Thu Jan 27' },
    { name: 'banana', expiry_date: 'Mon Jan 31' },
  ];
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const currentDate = new Date().toString().slice(0, 10);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  async function schedulePushNotification(notificationContent) {
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: { seconds: 2 },
    });
  }

  useEffect(() => {
    if (lastNotificationResponse) {
      Linking.openURL(
        lastNotificationResponse.notification.request.content.data.url,
      );
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    for (let i = 0; i < foodArray.length; i++) {
      if (foodArray[i].expiry_date === new Date().toString().slice(0, 10)) {
        schedulePushNotification({
          title: `${foodArray[i].name} is about to expire`,
          body: 'Open the fridge',
          data: {
            url: `exp://${
              Constants.manifest.hostUri.split(':')[0]
            }:19000/--/fridge/list`,
          },
        }).catch((err) => console.log(err));
      }
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const [itemAdded, setItemAdded] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [cameraData, setCameraData] = useState('testing.............');
  return (
    <itemContext.Provider value={{ itemAdded, setItemAdded }}>
      <cameraContext.Provider value={{ cameraData, setCameraData }}>
        <barcodeContext.Provider value={{ barcodeData, setBarcodeData }}>
          <NavigationContainer
            linking={linking}
            fallback={<Text>Loading...</Text>}
          >
            <MyTabs />
          </NavigationContainer>
        </barcodeContext.Provider>
      </cameraContext.Provider>
    </itemContext.Provider>
  );
}
