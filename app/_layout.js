import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppNavigator from '@/app/src/Navigations/AppNavigator';
import { UserRoleProvider } from '@/app/Services/context/userRoleContext';

export default function RootLayout() {
  return (
    <UserRoleProvider>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </UserRoleProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
