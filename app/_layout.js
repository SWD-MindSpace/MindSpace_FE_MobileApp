// global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;


import { StyleSheet, View } from 'react-native'
import React from 'react'
import AppNavigator from '@/app/src/Navigations/AppNavigator';

export default function rootLayout() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
