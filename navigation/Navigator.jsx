import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppWelcomeLogo from '../screens/AppWelcomeLogo';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import ForgotPassword from '../screens/ForgotPassword';
import VerifiedMail from '../screens/VerifiedMail';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Navigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    return (
            <Stack.Navigator>
                <Stack.Screen name='AppWelcomeLogo' component={AppWelcomeLogo} options={{ headerShown: false }} />
                <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name='MainScreen' component={MainScreen} />
                <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
                <Stack.Screen name='VerifiedMail' component={VerifiedMail} />
            </Stack.Navigator>
    )
}

export default Navigator

const styles = StyleSheet.create({})