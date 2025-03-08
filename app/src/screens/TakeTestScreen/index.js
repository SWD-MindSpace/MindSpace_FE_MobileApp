import { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTestResult, getTestHistory } from '../../utils/storageHelper';
import CONFIG from '@/app/src/config/config';

const TakeTestScreen = ({ route, navigation }) => {
    const { testId, testName } = route.params;
    const [testData, setTestData] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [testScore, setTestScore] = useState(null);

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const response = await fetch(
                    `${CONFIG.baseUrl}/${CONFIG.apiVersion}/tests/${testId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setTestData(data);
            } catch (error) {
                Alert.alert("Error", `Failed to load test data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchHistory = async () => {
            const history = await getTestHistory();
            setTestHistory(history);
        };

        fetchTestDetails();
        fetchHistory();
    }, [testId]);

    const handleOptionSelect = async (questionId, optionId, score = null) => {
        setResponses(prev => {
            const newResponses = { ...prev, [questionId]: { optionId, score } };
            // Save selected answers to AsyncStorage
            AsyncStorage.setItem('selectedAnswers', JSON.stringify(newResponses));
            return newResponses;
        });
    };

    const handleSubmit = async () => {
        if (!testData) return;

        if (Object.keys(responses).length !== testData.questions.length) {
            Alert.alert('Incomplete Test', 'Please answer all questions before submitting.');
            return;
        }

        setLoading(true);

        let totalScore = 0;
        let result = 'Undefined';

        if (testData.testCategory.name === 'Psychological') {
            totalScore = Object.values(responses).reduce((sum, res) => sum + (res.score || 0), 0);
            result = testData.testScoreRanks?.find(rank => totalScore >= rank.minScore && totalScore <= rank.maxScore)?.result || 'Undefined';
        } else {
            result = 'Survey Completed';
        }

        const dateTaken = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const values = await AsyncStorage.multiGet(['authToken', 'studentId', 'parentId']);
            const token = values[0][1];
            const studentId = values[1][1];
            const parentId = values[2][1];

            if (!studentId && !parentId) {
                Alert.alert("Error", "No Student or Parent ID found. Please re-login.");
                setLoading(false);
                return;
            }

            const testResponseData = {
                totalScore,
                testScoreRankResult: result,
                studentId: studentId ? parseInt(studentId) : null,
                parentId: parentId ? parseInt(parentId) : null,
                testId,
                testResponseItems: testData.questions.map((question) => ({
                    questionContent: question.content,
                    score: responses[question.id]?.score || 0,
                    answerText: (testData.testCategory.name === 'Psychological'
                        ? testData.psychologyTestOptions
                        : question.questionOptions)?.find(opt => opt.id === responses[question.id]?.optionId)?.displayedText || ''
                }))
            };

            const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/test-responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(testResponseData),
            });

            if (response.ok) {
                await saveTestResult(testId, testName, totalScore, result, dateTaken);
                setTestScore(totalScore);
                console.log("Test response created successfully")
            } else {
                const errorBody = await response.text();
                throw new Error(`Submission failed. Status: ${response.status}, ${errorBody}`);
            }

        } catch (error) {
            Alert.alert("Error", `Failed to submit test: ${error.message}`);
        } finally {
            navigation.navigate('ResourceResultScreen', { testId, testName, testScore });
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    if (!testData) return <Text style={styles.errorText}>Test not found</Text>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{testData.title}</Text>
            <Text style={styles.description}>{testData.description}</Text>
            {testData.questions.map((question) => (
                <View key={question.id} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.content}</Text>
                    {(testData.testCategory.name === 'Psychological' ? testData.psychologyTestOptions : question.questionOptions).map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[styles.optionContainer, responses[question.id]?.optionId === option.id && styles.selectedOption]}
                            onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                        >
                            <RadioButton
                                value={option.id}
                                status={responses[question.id]?.optionId === option.id ? 'checked' : 'unchecked'}
                                onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                                color="#007BFF"
                            />
                            <Text style={styles.optionText}>{option.displayedText}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default TakeTestScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#F0F5FF' },
    loader: { marginTop: 50 },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 20 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#007BFF', marginBottom: 10, textAlign: 'center' },
    description: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 20 },
    questionContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowOpacity: 0.1,
        elevation: 3
    },
    questionText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
    optionContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8 },
    optionText: { fontSize: 16, color: '#333' },
    selectedOption: { backgroundColor: '#D0E5FF' },
    submitButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    submitButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
});
