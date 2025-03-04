import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, Pressable, Alert } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getTestHistory, clearTestHistory, saveTestResult } from '@/app/src/utils/storageHelper';
import CONFIG from '@/app/src/config/config';
import moment from 'moment';

const ResourceScreen = ({ navigation }) => {
    const resourceApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/tests`;
    const [resources, setResources] = useState([]);
    const [testHistory, setTestHistory] = useState([]);

    useEffect(() => {
        getAllResources();
        loadTestHistory();
    }, []);

    const getAllResources = async () => {
        try {
            const response = await fetch(resourceApiURL);
            const jsonData = await response.json();
            if (jsonData?.data) {
                setResources(jsonData.data);
            }
        } catch (error) {
            console.error("Error fetching resource data:", error);
        }
    };

    const loadTestHistory = async () => {
        const history = await getTestHistory();
        setTestHistory(history);
    };

    const handleClearHistory = async () => {
        await clearTestHistory();
        setTestHistory([]);
    };

    const handleTestSelection = (testId, title) => {
        const previousTest = testHistory.find((test) => test.testId === testId);
        if (previousTest) {
            Alert.alert(
                "Retake Test?",
                `You have taken this test before. Your last score was ${previousTest.totalScore}. Do you want to retake it?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Retake",
                        onPress: () => navigation.navigate('ResourceDetailScreen', { testId }),
                    },
                ]
            );
        } else {
            navigation.navigate('ResourceDetailScreen', { testId });
        }
    };

    const handleSaveTestResult = async (testId, score, result) => {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedHistory = testHistory.filter((test) => test.testId !== testId);
        const newEntry = { testId, totalScore: score, result, timestamp };
        updatedHistory.push(newEntry);
        setTestHistory(updatedHistory);
        await saveTestResult(testId, score, result, timestamp);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
            <FlatList
                ListHeaderComponent={<Text style={styles.sectionHeader}>Available Tests</Text>}
                data={resources}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resourceItem}
                        onPress={() => handleTestSelection(item.id, item.title)}
                    >
                        <View style={styles.resourceTextContainer}>
                            <Text style={styles.resourceTitle}>{item.title}</Text>
                            <Text style={styles.resourceDescription}>{item.description}</Text>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <FontAwesome5 name="bullseye" size={16} color="red" />
                                <Text>Target: {item.targetUser}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <FontAwesome5 name="question-circle" size={16} color="blue" />
                                <Text>Number of questions: {item.questionCount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <>
                        <Text style={styles.sectionHeader}>Test History</Text>
                        <Pressable style={styles.clearButton} onPress={handleClearHistory}>
                            <Text style={styles.clearButtonText}>Clear Test History</Text>
                        </Pressable>
                        <FlatList
                            data={testHistory}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.historyItem}>
                                    <Text style={styles.historyText}>Test ID: {item.testId}</Text>
                                    <Text style={styles.historyText}>Score: {item.totalScore}</Text>
                                    <Text style={styles.historyText}>Result: {item.result || 'No result available'}</Text>
                                    <Text style={styles.historyText}>Submitted: {moment(item.timestamp).fromNow()}</Text>
                                </View>
                            )}
                        />
                    </>
                }
            />
        </View>
    );
};

const styles = {
    sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    resourceItem: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10, marginVertical: 8, elevation: 3 },
    resourceTextContainer: { padding: 10 },
    resourceTitle: { fontSize: 16, fontWeight: 'bold' },
    resourceDescription: { fontSize: 14, color: '#666' },
    historyItem: { padding: 10, backgroundColor: '#e3f2fd', borderRadius: 10, marginVertical: 5 },
    historyText: { fontSize: 16, color: '#333' },
    clearButton: { backgroundColor: 'red', padding: 10, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
    clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
};

export default ResourceScreen;