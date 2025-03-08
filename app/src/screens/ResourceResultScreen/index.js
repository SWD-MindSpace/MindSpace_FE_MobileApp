import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import CONFIG from '@/app/src/config/config';
import { Card } from 'react-native-paper';
import { getTestHistory } from '@/app/src/utils/storageHelper';

const ResourceResultScreen = ({ route, navigation }) => {
    const { testId } = route.params;
    const [testHistory, setTestHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchTestHistory = async () => {
            try {
                const history = await getTestHistory();
                setTestHistory(history);
            } catch (err) {
                setError('Failed to load test history.');
                console.error('Error fetching test history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestHistory();
    }, []);

    const [testResponses, setTestResponses] = useState([]);
    useEffect(() => {
        const fetchTestResponses = async () => {
            try {
                const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/test-responses/${testId}`);
                if (!response.ok) {
                    setError('Failed to load test responses.');
                    return;
                }

                const data = await response.json();
                setTestResponses(Array.isArray(data.testResponseItems) ? data.testResponseItems : []);
            } catch (err) {
                setError(`Failed to load test responses: ${err.message}`);
                console.error('Error fetching test responses:', err);
            }
        };

        fetchTestResponses();
    }, [testId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }


    const testHistoryEntry = testHistory.find(entry => entry.testId === testId);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Test Results</Text>
            <Card style={styles.summaryCard}>
                <Text style={styles.summaryText}>Total Score: <Text style={styles.boldText}>{testHistoryEntry?.totalScore}</Text></Text>
                <Text style={styles.summaryText}>Result: <Text style={styles.boldText}>{testHistoryEntry?.result}</Text></Text>
            </Card>

            {testResponses.map((item, index) => (
                <Card key={index} style={styles.responseCard}>
                    <Text style={styles.questionText}>Q{index + 1}: {item.questionContent}</Text>
                    <Text style={styles.answerText}>Your Answer: {item.answerText}</Text>
                    <Text style={styles.scoreText}>Score: {item.score}</Text>
                </Card>
            ))}

            <Button
                title="Explore more tests"
                style={styles.backButton}
                onPress={() => navigation.navigate('MainScreen', { screen: 'Resource' })}
            />


        </ScrollView>
    );
};

export default ResourceResultScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#F5F7FA' },
    loader: { marginTop: 50 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#007BFF', marginBottom: 20, textAlign: 'center' },
    summaryCard: { width: '100%', padding: 15, backgroundColor: '#E3F2FD', borderRadius: 10, marginBottom: 15 },
    summaryText: { fontSize: 18, textAlign: 'center', color: '#333' },
    boldText: { fontWeight: 'bold', color: '#007BFF' },
    responseCard: { width: '100%', padding: 15, backgroundColor: 'white', borderRadius: 10, marginBottom: 10, shadowOpacity: 0.1, elevation: 3 },
    questionText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    answerText: { fontSize: 16, color: '#444', marginTop: 5 },
    scoreText: { fontSize: 16, color: '#28A745', marginTop: 5, fontWeight: 'bold' },
    optionText: { fontSize: 16, color: '#333', marginTop: 5, fontStyle: 'italic' },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
    backButton: { marginTop: 20, padding: 10, backgroundColor: '#007BFF', borderRadius: 5, alignItems: 'center', width: '100%' }
});
