import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getTestHistory, clearTestHistory } from '@/app/src/utils/storageHelper';

const TestHistoryScreen = ({ navigation }) => {
    const [testResults, setTestResults] = useState([]);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        const results = await getTestHistory();
        setTestResults(results);
    };

    const handleClearHistory = async () => {
        await clearTestHistory();
        setTestResults([]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Test History</Text>
            {testResults.length > 0 ? (
                <FlatList
                    data={testResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.text}>Test ID: {item.testId}</Text>
                            <Text style={styles.text}>Score: {item.score}</Text>
                            <Text style={styles.result}>Result: {item.result}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.text}>No test results found.</Text>
            )}

            <Button title="Clear History" onPress={handleClearHistory} color="red" />
            <Button title="Back to Home" onPress={() => navigation.navigate('MainScreen')} color="#007BFF" />
        </View>
    );
};

export default TestHistoryScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    text: { fontSize: 16, marginBottom: 5 },
    result: { fontSize: 18, fontWeight: 'bold', color: '#28A745' },
    item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', width: '100%' },
});
