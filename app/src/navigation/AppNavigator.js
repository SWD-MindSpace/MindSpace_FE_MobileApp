import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppWelcomeLogo from '@/app/src/screens/AppWelcomeLogo';
import MainScreen from '@/app/src/screens/MainScreen';
import ForgotPassword from '@/app/src/screens/ForgotPassword';
import VerifiedMail from '@/app/src/screens/VerifiedMail';
import ResourceScreen from '../screens/ResourceScreen';
import ServiceScreen from '../screens/ServiceScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '@/app/src/screens/LoginScreen';
import { getAuthToken, removeAuthToken } from '@/app/src/utils/storage';
import { useNavigation } from '@react-navigation/native';
import BlogDetail from '@/app/src/screens/BlogDetail';
import ResourceDetailScreen from '../screens/ResourceDetailScreen';
import SPDetailScreen from '../screens/SPDetailScreen';
import SignUpSPScreen from '../screens/SignUpSPScreen';
import ArticleDetail from '../screens/ArticleDetail';
import TakeTestScreen from '@/app/src/screens/TakeTestScreen';
import ResourceResultScreen from '@/app/src/screens/ResourceResultScreen';
import TestHistoryScreen from '@/app/src/screens/TestHistoryScreen';
import CONFIG from '../config/config';

function MainTabs() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Resource') iconName = 'book';
          else if (route.name === 'Service') iconName = 'settings';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Home" component={MainScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Resource" component={ResourceScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Service" component={ServiceScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const apiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/logout`;

  const handleSignOut = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token found, redirecting to login.");
        navigation.navigate("LoginScreen");
        return;
      }
      console.log("Token retrieved:", token);
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("Response Status:", response.status);
      if (response.ok) {
        setMenuVisible(false);
        console.log("Logout successful");
        await removeAuthToken();
        navigation.navigate("LoginScreen");
      } else {
        const errorText = await response.text();
        console.error("Logout failed:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="AppWelcomeLogo" component={AppWelcomeLogo} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainScreen"
          component={MainTabs}
          options={{
            title: "MindSpace",
            headerBackVisible: false,
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerRight: () => (
              <Pressable
                onPress={() => setMenuVisible(true)}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                style={[styles.menuButton, isPressed && styles.menuButtonActive]}
              >
                <Text style={styles.menuText}>⋮</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="ResourceDetailScreen" component={ResourceDetailScreen} />
        <Stack.Screen name="TakeTestScreen" component={TakeTestScreen} />
        <Stack.Screen name="ResourceResultScreen" component={ResourceResultScreen} />
        <Stack.Screen name="BlogDetail" component={BlogDetail} />
        <Stack.Screen name="ArticleDetail" component={ArticleDetail} />
        <Stack.Screen name="TestHistoryScreen" component={TestHistoryScreen} />
        <Stack.Screen name="SPDetailScreen" component={SPDetailScreen} />
        <Stack.Screen name="SignUpSPScreen" component={SignUpSPScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifiedMail" component={VerifiedMail} />
      </Stack.Navigator>

      {/* Dropdown Menu Modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("ProfileScreen");
              }}
            >
              <Text style={styles.dropdownText}>See Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSignOut()}>
              <Text style={styles.dropdownText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  menuButton: {
    width: 37,
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
  menuButtonActive: {
    backgroundColor: "lightgray",
  },
  menuText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingTop: 60,
    paddingRight: 15,
  },
  dropdownMenu: {
    backgroundColor: "white",
    width: 150,
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
  },
});

export default AppNavigator;
