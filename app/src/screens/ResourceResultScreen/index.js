import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { getTestHistory } from '@/app/Services/Utils/storageHelper';
import useFetchTestResponse from '@/app/Services/Features/Test/useFetchTestResponse';

const ResourceResultScreen = ({ route, navigation }) => {
    const { testId } = route.params;
    const [testHistory, setTestHistory] = useState([]);
    const { testResponses, loading, error } = useFetchTestResponse(testId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const history = await getTestHistory();
                setTestHistory(Array.isArray(history) ? history : []);
            } catch (err) {
                console.error('Error fetching test history:', err);
            }
        };
        fetchData();
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

    const testHistoryEntry = testHistory.find(entry => entry.testId === testId) || {};
    const responseItems = testResponses?.testResponseItems || [];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Test Results</Text>
            <Card style={styles.summaryCard}>
                <Text style={styles.summaryText}>Total Score: <Text style={styles.boldText}>{testHistoryEntry.totalScore ?? 'N/A'}</Text></Text>
                <Text style={styles.summaryText}>Result: <Text style={styles.boldText}>{testHistoryEntry.result ?? 'N/A'}</Text></Text>
            </Card>

            {responseItems.length > 0 ? (
                responseItems.map((item, index) => (
                    <Card key={index} style={styles.responseCard}>
                        <Text style={styles.questionText}>Q{index + 1}: {item.questionContent}</Text>
                        <Text style={styles.answerText}>Your Answer: {item.answerText}</Text>
                        <Text style={styles.scoreText}>Score: {item.score}</Text>
                    </Card>
                ))
            ) : (
                <Text style={styles.noDataText}>No responses found for this test.</Text>
            )}

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('MainScreen', { screen: 'Resource' })}
            >
                <Text style={styles.backButtonText}>Explore more tests</Text>
            </TouchableOpacity>
        </ScrollView >
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
    noDataText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
    backButton: { marginTop: 20, padding: 15, backgroundColor: '#007BFF', borderRadius: 5, alignItems: 'center', width: '100%' },
    backButtonText: { fontSize: 18, color: 'white', fontWeight: 'bold' }
});
