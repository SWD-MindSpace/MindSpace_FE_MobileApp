import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AppWelcomeLogo from '../screens/AppWelcomeLogo';
import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
const Navigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='AppWelcome' component={AppWelcomeLogo} />
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='MainScreen' component={MainScreen} />
        </Stack.Navigator>
    )
}

export default Navigator

const styles = StyleSheet.create({})