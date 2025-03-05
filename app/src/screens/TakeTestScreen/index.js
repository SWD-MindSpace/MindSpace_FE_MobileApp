import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveTestResult, getTestHistory } from '../../utils/storageHelper';

const TakeTestScreen = ({ route, navigation }) => {
    const { testId, questions, psychologyTestOptions, testScoreRanks } = route.params;
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false);
    const [testScore, setTestScore] = useState(null);
    const [testResult, setTestResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [testHistory, setTestHistory] = useState([]);

    const handleSaveTestResult = async (testId, score, result) => {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

        // Save the result in AsyncStorage
        await saveTestResult(testId, score, result, timestamp);

        // Reload history after saving
        const updatedHistory = await getTestHistory();
        setTestHistory(updatedHistory);
    };

    const handleOptionSelect = (questionId, optionId, score) => {
        setResponses({ ...responses, [questionId]: { optionId, score } });
    };

    const handleSubmit = async () => {
        if (Object.keys(responses).length !== questions.length) {
            Alert.alert('Incomplete Test', 'Please answer all questions before submitting.');
            return;
        }

        setLoading(true);

        let totalScore = Object.values(responses).reduce((sum, res) => sum + res.score, 0);
        let result = testScoreRanks?.find(rank => totalScore >= rank.minScore && totalScore <= rank.maxScore)?.result || 'Your answer have been saved';

        setTimeout(async () => {
            setTestScore(totalScore);
            setTestResult(result);
            setShowResult(true);
            setLoading(false);

            // Save test result and refresh history
            await handleSaveTestResult(testId, totalScore, result);

            // Clear saved responses
            await AsyncStorage.removeItem(`test_${testId}`);
        }, 1000);
    };

    if (loading) return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!showResult ? (
                <>
                    <Text style={styles.header}>Take Test</Text>
                    {questions.map((question) => (
                        <View key={question.id} style={styles.questionContainer}>
                            <Text style={styles.questionText}>{question.content}</Text>
                            {psychologyTestOptions.length > 0
                                ? psychologyTestOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionContainer,
                                            responses[question.id]?.optionId === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                                    >
                                        <RadioButton
                                            value={option.id}
                                            status={responses[question.id]?.optionId === option.id ? 'checked' : 'unchecked'}
                                            onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                                            color="#007BFF"
                                        />
                                        <Text style={styles.optionText}>{option.displayedText} </Text>
                                    </TouchableOpacity>
                                ))
                                : question.questionOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionContainer,
                                            responses[question.id]?.optionId === option.id && styles.selectedOption
                                        ]}
                                        onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                                    >
                                        <RadioButton
                                            value={option.id}
                                            status={responses[question.id]?.optionId === option.id ? 'checked' : 'unchecked'}
                                            onPress={() => handleOptionSelect(question.id, option.id, option.score)}
                                            color="#007BFF"
                                        />
                                        <Text style={styles.optionText}>{option.displayedText} </Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    ))}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.header}>Test Results</Text>
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Total Score: {testScore}</Text>
                        <Text style={styles.resultText}>Result: {testResult}</Text>
                    </View>
                    <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('MainScreen', { screen: 'Resource' })}>
                        <Text style={styles.homeButtonText}>Back to Test Screen</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

export default TakeTestScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#F0F5FF' },
    loader: { marginTop: 50 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#007BFF', marginBottom: 20, textAlign: 'center' },
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
    resultContainer: { padding: 20, backgroundColor: 'white', borderRadius: 10, elevation: 3, marginBottom: 20 },
    resultText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#007BFF' },
    homeButton: { backgroundColor: '#DC3545', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    homeButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' }
});