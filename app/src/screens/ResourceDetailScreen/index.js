import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import useTests from '@/app/Services/Features/Test/useTests';

const ResourceDetailScreen = ({ route, navigation }) => {
    const { testId, testCategory } = route.params;
    const { tests, loading } = useTests(1, 10, null);
    const testDetails = tests.find(test => test.id === testId);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!testDetails) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Failed to load test details.</Text>
            </View>
        );
    }

    const isPsychologicalTest = testDetails.type === 'psychological';
    const isPeriodicTest = testDetails.type === 'periodic';

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{testDetails.title}</Text>
            <Text style={styles.text}>{testDetails.description}</Text>
            <Text style={styles.text}>Number of Questions: {testDetails.questionCount}</Text>
            <Text style={styles.text}>Author: {testDetails.author?.fullName || 'Unknown'}</Text>

            {isPsychologicalTest && (
                <Text style={styles.infoText}>This is a psychological test with structured multiple-choice questions.</Text>
            )}
            {isPeriodicTest && (
                <Text style={styles.infoText}>This is a periodic test with standard question formats.</Text>
            )}

            <Button
                title="Take Test"
                onPress={() => navigation.navigate('TakeTestScreen', {
                    testId: testDetails.id,
                    testName: testDetails.title,
                    testCategory,
                    questions: testDetails.questions || [],
                    psychologyTestOptions: isPsychologicalTest ? testDetails.psychologyTestOptions || [] : [],
                    testScoreRanks: testDetails.testScoreRanks || [],
                })}
                color="#007BFF"
            />
        </ScrollView>
    );
};

export default ResourceDetailScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    text: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
    infoText: { fontSize: 14, fontWeight: 'bold', color: '#007BFF', marginBottom: 15 },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});