import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CONFIG from '@/app/src/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TakeTestScreen = ({ route, navigation }) => {
    const { testId, questions, psychologyTestOptions, testScoreRanks } = route.params;
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const [testScore, setTestScore] = useState(null);
    const [testResult, setTestResult] = useState(null);

    const handleOptionSelect = (questionId, optionId, score) => {
        setResponses({ ...responses, [questionId]: { optionId, score } });
    };

    const saveTestResult = async (testId, totalScore, result, testResponseItems) => {
        try {
            const newResult = { testId, totalScore, result, testResponseItems };
            const storedResults = await AsyncStorage.getItem('testResults');
            let testResults = storedResults ? JSON.parse(storedResults) : [];
            testResults.push(newResult);
            await AsyncStorage.setItem('testResults', JSON.stringify(testResults));
            console.log("Test result saved successfully!");
        } catch (error) {
            console.error("Error saving test result:", error);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(responses).length !== questions.length) {
            Alert.alert('Incomplete Test', 'Please answer all questions before submitting.');
            return;
        }

        setLoading(true);

        try {
            let totalScore = 0;
            let result = null;
            let testResponseItems = [];

            if (psychologyTestOptions.length > 0) {
                totalScore = Object.values(responses).reduce((sum, res) => sum + res.score, 0);
                setTestScore(totalScore);

                if (testScoreRanks?.length > 0) {
                    result = testScoreRanks.find(
                        (rank) => totalScore >= rank.minScore && totalScore <= rank.maxScore
                    )?.result || 'No matching score range found';
                }
                setTestResult(result);
            } else {
                const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/testresponses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        testId,
                        responses: Object.entries(responses).map(([questionId, data]) => ({
                            questionId: parseInt(questionId),
                            optionId: data.optionId,
                        })),
                    }),
                });

                const text = await response.text();
                if (!response.ok) throw new Error(`Submission failed: ${response.status} - ${text}`);

                if (text.trim()) {
                    const data = JSON.parse(text);
                    totalScore = data.totalScore;
                    setTestScore(totalScore);
                    testResponseItems = data.testResponseItems;
                } else {
                    throw new Error('Empty response from server');
                }
            }

            saveTestResult(testId, totalScore, result, testResponseItems);

            navigation.navigate('ResourceResultScreen', { testId, score: totalScore, result });

        } catch (error) {
            console.error('Error:', error.message);
            Alert.alert('Submission Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Take Test</Text>

            {questions.map((question) => (
                <View key={question.id} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.content}</Text>

                    {psychologyTestOptions.length > 0
                        ? psychologyTestOptions.map((option) => (
                            <View key={option.id} style={styles.optionContainer}>
                                <RadioButton
                                    value={option.id}
                                    status={responses[question.id]?.optionId === option.id ? 'checked' : 'unchecked'}
                                    onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                                />
                                <Text>{option.displayedText}</Text>
                            </View>
                        ))
                        : question.questionOptions.map((option) => (
                            <View key={option.id} style={styles.optionContainer}>
                                <RadioButton
                                    value={option.id}
                                    status={responses[question.id]?.optionId === option.id ? 'checked' : 'unchecked'}
                                    onPress={() => handleOptionSelect(question.id, option.id, 0)}
                                />
                                <Text>{option.displayedText}</Text>
                            </View>
                        ))}
                </View>
            ))}

            <Button title="Submit" onPress={handleSubmit} disabled={loading} color="#007BFF" />
        </ScrollView>
    );
};

export default TakeTestScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    questionContainer: { marginBottom: 20, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 8 },
    optionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
});
