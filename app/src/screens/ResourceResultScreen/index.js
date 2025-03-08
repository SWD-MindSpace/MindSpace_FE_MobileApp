import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import CONFIG from '@/app/src/config/config';

const ResourceResultScreen = ({ route, navigation }) => {
    const { testId, score, result } = route.params;
    const [testResponses, setTestResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestResponses = async () => {
            try {
                const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/testresponses?testId=${testId}`);
                const jsonData = await response.json();

                if (jsonData?.data) {
                    setTestResponses(jsonData.data);
                } else {
                    setError('No responses found.');
                }
            } catch (err) {
                setError('Failed to load test responses.');
                console.error('Error fetching test responses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestResponses();
    }, [testId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Test Results</Text>
            <Text style={styles.text}>Total Score: {score}</Text>
            <Text style={styles.text}>Result: {result}</Text>

            {testResponses.map((item) => (
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
