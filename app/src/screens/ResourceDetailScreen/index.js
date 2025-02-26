import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ResourceDetailScreen = ({ route }) => {
    const { testId } = route.params; 

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Test Details</Text>
            <Text style={styles.text}>Test ID: {testId}</Text> 
        </View>
    );
};

export default ResourceDetailScreen;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    text: { fontSize: 16 },
});
