import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppWelcomeLogo from '@/app/src/screens/AppWelcomeLogo';
import HomeScreen from '@/app/src/screens/HomeScreen';
import MainScreen from '@/app/src/screens/MainScreen';
import ForgotPassword from '@/app/src/screens/ForgotPassword';
import VerifiedMail from '@/app/src/screens/VerifiedMail';

export default function AppNavigator() {
    const Stack = createNativeStackNavigator();
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

const styles = StyleSheet.create({})