import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getTestHistory, removeTestHistoryItem } from '../../utils/storageHelper';

const TestHistoryScreen = () => {
    const [testHistory, setTestHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        const history = await getTestHistory();
        setTestHistory(history.slice().reverse());
        setLoading(false);
    };

    const handleRemove = async (index) => {
        await removeTestHistoryItem(index);
        fetchHistory();
    };

    if (loading) return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    if (testHistory.length === 0) return <Text style={styles.emptyText}>No test history found.</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Test History</Text>
            <FlatList
                data={testHistory}
                keyExtractor={(item, index) => `${item.testId}_${index}`}
                renderItem={({ item, index }) => (
                    <View style={styles.historyItem}>
                        <Text style={styles.testTitle}>Test Name: {item.testName}</Text>
                        <Text style={styles.testResult}>Result: {item.result}</Text>
                        <Text style={styles.testScore}>Score: {item.totalScore}</Text>
                        <Text style={styles.dateTaken}>Date: {item.timestamp}</Text>

                        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(index)}>
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default TestHistoryScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F0F5FF' },
    loader: { marginTop: 50 },
    emptyText: { fontSize: 18, color: '#555', textAlign: 'center', marginTop: 20 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#007BFF', marginBottom: 20, textAlign: 'center' },
    historyItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowOpacity: 0.1,
        elevation: 3
    },
    testTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    testResult: { fontSize: 16, color: '#007BFF', marginTop: 5 },
    testScore: { fontSize: 16, color: '#28A745', marginTop: 5 },
    dateTaken: { fontSize: 14, color: '#777', marginTop: 5 },
    removeButton: { marginTop: 10, padding: 8, backgroundColor: 'red', borderRadius: 5, alignItems: 'center' },
    removeButtonText: { color: 'white', fontWeight: 'bold' }
});
