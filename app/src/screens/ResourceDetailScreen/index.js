import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import CONFIG from '@/app/src/config/config';
import React from 'react';

const ResourceDetailScreen = ({ route, navigation }) => {
    const { testId } = route.params;
    const [testDetails, setTestDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/tests/${testId}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch test details: ${response.status} - ${errorText}`);
                }

                // Check if response contains JSON
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid response format: Expected JSON.");
                }

                const data = await response.json();
                setTestDetails(data);
            } catch (error) {
                console.error('Error:', error.message);
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTestDetails();
    }, [testId]);

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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{testDetails.title}</Text>
            <Text style={styles.text}>{testDetails.description}</Text>
            <Text style={styles.text}>Number of Questions: {testDetails.questionCount}</Text>
            <Text style={styles.text}>Author: {testDetails.author?.fullName || 'Unknown'}</Text>

            <Button
                title="Take Test"
                onPress={() => navigation.navigate('TakeTestScreen', {
                    testId: testDetails.id,
                    questions: testDetails.questions || [],
                    psychologyTestOptions: testDetails.psychologyTestOptions || [],
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
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    text: { fontSize: 16, marginBottom: 10, textAlign: 'center' },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
