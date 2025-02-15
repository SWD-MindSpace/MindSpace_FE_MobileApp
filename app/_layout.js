import { StyleSheet, View } from 'react-native'
import React from 'react'
import ScreenLayout from './screens/_layout';

export default function rootLayout() {
  return (
    <View style={styles.container}>
      <ScreenLayout />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
