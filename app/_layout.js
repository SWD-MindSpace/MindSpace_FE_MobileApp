import { StyleSheet, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from '@/app/src/navigation/AppNavigator';
import AuthProvider from "@/app/src/context/AuthContext";

export default function rootLayout() {
  return (
    <AuthProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
    </AuthProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
