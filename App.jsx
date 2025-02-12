import { StyleSheet, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Navigator from './navigation/Navigator'

const App = () => {
    return (
        <NavigationContainer>
            <View style={styles.container}>
                <Navigator />
            </View>
        </NavigationContainer>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});
