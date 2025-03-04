import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import StorageHelper from '@/app/src/utils/storageHelper';
import React from 'react';

const ResourceResultScreen = ({ route, navigation }) => {
    const { testId, score, result } = route.params;
    const [testResponses, setTestResponses] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoredResult = async () => {
            try {
                const storedResults = await StorageHelper.getItem('testResults'); // Use StorageHelper
                if (storedResults) {
                    const foundResult = storedResults.find(res => res.testId === testId);
                    if (foundResult) {
                        setTestResponses(foundResult);
                    }
                }
            } catch (error) {
                console.log('Error fetching test result:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoredResult();
    }, [testId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" />;
    }

    if (!testResponses) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load test responses.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Test Results</Text>
            <Text style={styles.text}>Total Score: {score}</Text>
            <Text style={styles.text}>Result: {result}</Text>

            {testResponses?.testResponseItems?.map((item) => (
                <View key={item.id} style={styles.responseItemContainer}>
                    <Text style={styles.text}>Question: {item.questionContent}</Text>
                    <Text style={styles.text}>Answer: {item.answerText}</Text>
                    <Text style={styles.text}>Score: {item.score}</Text>
                </View>
            ))}
            <Button title="Go Back Home" onPress={() => navigation.navigate('MainScreen')} />
        </ScrollView>
    );
};

export default ResourceResultScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    text: { fontSize: 16, marginBottom: 5 },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
    responseItemContainer: { marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, width: '100%' },
});
