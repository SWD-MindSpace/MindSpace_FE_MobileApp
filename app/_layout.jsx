import { StyleSheet, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Navigator from '@/navigation/Navigator';

export default function rootLayout() {
  return (
      <View style={styles.container}>
        <Navigator />
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
