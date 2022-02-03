/* eslint-disable quotes */
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
import moment from 'moment';
import { getDocs, collection } from 'firebase/firestore';
import { Alert, Platform, Text, StyleSheet } from 'react-native';
import { db } from './core/Config';
import { barcodeContext, itemContext } from './context';
import Camera from './components/Camera';
import AddItemFormik from './components/AddItemFormik';
import Recipes from './components/Recipes';
import FridgeNavigator from './navigation/FridgeNavigator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const pathwayURL = Constants.manifest.hostUri.split(':')[0];
const Tab = createBottomTabNavigator();

function MyTabs({ barcodeData }) {
  return (
    <Tab.Navigator
      initialRouteName="Fridge"
      screenOptions={{
        tabBarActiveTintColor: '#85b4e0',
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
          headerShown: false,
          tabBarLabel: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" color={color} size={size} />
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
    Camera: 'camera',
    'Add Item': 'add',
  },
};

export default function App() {
  const linking = {
    prefixes: [prefix],
    config,
  };

  const getFoodItems = () => {
    const colRef = collection(db, 'FoodItems');
    return getDocs(colRef)
      .then((snapshot) => {
        const foodItems = [];
        snapshot.docs.forEach((doc) => {
          foodItems.push({ ...doc.data(), id: doc.id });
        });
        return foodItems;
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const [itemAdded, setItemAdded] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  async function schedulePushNotification(notificationContent) {
    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: { seconds: 2 },
    });
  }

  useEffect(() => {
    getFoodItems().then((result) => {
      for (let i = 0; i < result.length; i++) {
        if (
          moment(result[i].expiration_date).format('MMM Do YY') ===
          moment().format('MMM Do YY')
        ) {
          schedulePushNotification({
            title: `${result[i].food_item} is expiring today!`,
            body: `🍽️ Let's get cooking!🍳`,
            data: {
              url: `exp://${pathwayURL}:19000/--/fridge/list`,
            },
          }).catch((err) => console.log(err));
        }
      }
    });
  }, [itemAdded]);

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

  return (
    <itemContext.Provider value={{ itemAdded, setItemAdded }}>
      <barcodeContext.Provider value={{ barcodeData, setBarcodeData }}>
        <NavigationContainer
          linking={linking}
          fallback={<Text>Loading...</Text>}
        >
          <MyTabs style={styles.app} />
        </NavigationContainer>
      </barcodeContext.Provider>
    </itemContext.Provider>
  );
}

const styles = StyleSheet.create({
  app: { backgroundColor: '#85b4e0' },
});
