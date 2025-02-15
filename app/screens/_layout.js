import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppWelcomeLogo from '@/app/screens/AppWelcomeLogo';
import HomeScreen from '@/app/screens/HomeScreen';
import MainScreen from '@/app/screens/MainScreen';
import ForgotPassword from '@/app/screens/ForgotPassword';
import VerifiedMail from '@/app/screens/VerifiedMail';

export default function ScreenLayout() {
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