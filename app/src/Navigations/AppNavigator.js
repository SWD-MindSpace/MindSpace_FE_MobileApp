import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import CONFIG from '../../Services/Configs/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppWelcomeLogo from '@/app/src/Screens/AppWelcomeLogo';
import MainScreen from '@/app/src/Screens/MainScreen';
import ForgotPassword from '@/app/src/Screens/ForgotPassword';
import VerifiedMail from '@/app/src/Screens/VerifiedMail';
import ResourceScreen from '../Screens/ResourceScreen';
import ServiceScreen from '@/app/src/Screens/ServiceScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import LoginScreen from '@/app/src/Screens/LoginScreen';
import BlogDetail from '@/app/src/Screens/BlogDetail';
import ResourceDetailScreen from '../Screens/ResourceDetailScreen';
import SPDetailScreen from '../Screens/SPDetailScreen';
import SignUpSPScreen from '../Screens/SignUpSPScreen';
import ArticleDetail from '../Screens/ArticleDetail';
import TakeTestScreen from '@/app/src/Screens/TakeTestScreen';
import ResourceResultScreen from '@/app/src/Screens/ResourceResultScreen';
import TestHistoryScreen from '@/app/src/Screens/TestHistoryScreen';
import { useEffect } from 'react';

function MainTabs() {
    const Tab = createBottomTabNavigator();
    const [userRole, setUserRole] = useState(null); // state to store the userRole
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('userRole');
                if (storedRole) {
                    setUserRole(storedRole);
                }
            } catch (error) {
                console.error("Error fetching userRole from AsyncStorage", error);
            }
        };

        fetchUserRole(); 
    }, []); 


    if (userRole === null) {
        // You can show a loading spinner or some placeholder until userRole is fetched
        return null; // Or a loading component
    }

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
            <Tab.Screen
                name="Home"
                component={MainScreen}
                initialParams={{ userRole }} // Pass userRole as a parameter to MainScreen
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Resource"
                component={(props) => <ResourceScreen {...props} userRole={userRole} />}
                options={{ headerShown: false }} />
            <Tab.Screen
                name="Service"
                component={(props) => <ServiceScreen {...props} userRole={userRole} />}
                options={{ headerShown: false }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}

function AppNavigator() {
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const apiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identities/logout`;

    const handleSignOut = async (navigation) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                console.warn("No auth token found, redirecting to login.");
                await AsyncStorage.removeItem('userRole');
                await AsyncStorage.removeItem('studentId');
                await AsyncStorage.removeItem('parentId');
                navigation.replace("LoginScreen");
                return;
            }

            // Call the API to log out
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Successfully logged out");

                // Clear all related data
                await AsyncStorage.removeItem('authToken');
                await AsyncStorage.removeItem('userRole');
                await AsyncStorage.removeItem('studentId');
                await AsyncStorage.removeItem('parentId');
                setMenuVisible(false);
                // Navigate to login screen after logout
                navigation.navigate("LoginScreen");
            } else {
                console.error("Logout failed:", response.status);
                Alert.alert("Logout Failed", "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Logout Failed", "Something went wrong. Please try again.");
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
                <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
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
                                navigation.navigate("MainScreen", { screen: "Profile" });
                            }}
                        >
                            <Text style={styles.dropdownText}>See Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSignOut(navigation)}>
                            <Text style={styles.dropdownText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

export default AppNavigator

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

