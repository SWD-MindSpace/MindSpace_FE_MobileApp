import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { getTestHistory } from '@/app/src/utils/storageHelper';
import CONFIG from '@/app/src/config/config';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResourceScreen = ({ navigation }) => {
    const [resources, setResources] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadUserRole();
    }, []);

    useEffect(() => {
        if (userRole) {
            fetchTests();
        }
    }, [userRole, pageIndex, selectedCategory]);

    const loadUserRole = async () => {
        try {
            const role = await AsyncStorage.getItem('userRole');
            setUserRole(role);
        } catch (error) {
            console.error("Error loading user role:", error);
        }
    };

    const fetchTests = async () => {
        setLoading(true);
        try {
            const resourceApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/tests?pageIndex=${pageIndex}&pageSize=${pageSize}`;
            const response = await fetch(resourceApiURL);
            const jsonData = await response.json();

            if (jsonData?.data) {
                const filteredTests = jsonData.data.filter(test => test.targetUser === userRole && test.testCategory.name !== "Parenting");

                // Extract categories once
                if (categories.length === 0) {
                    const uniqueCategories = [...new Set(filteredTests.map(test => test.testCategory.name))];
                    setCategories(uniqueCategories);
                }

                // Apply category filtering
                const categoryFilteredTests = selectedCategory
                    ? filteredTests.filter(test => test.testCategory.name === selectedCategory)
                    : filteredTests;

                // Reset instead of appending when navigating back
                setResources(categoryFilteredTests);

                setTotalCount(jsonData.count);
            }
        } catch (error) {
            console.error("Error fetching test data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestSelection = (testId, testName) => {
        navigation.navigate('ResourceDetailScreen', { testId, testName });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <Text style={styles.sectionHeader}>Available Tests</Text>

            {/* Category Selection (Placed below Available Tests header but above tests) */}
            <View>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.categoryContainer}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[
                                styles.categoryButton,
                                selectedCategory === item && styles.selectedCategory
                            ]}
                            onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
                        >
                            <Text style={styles.categoryText}>{item}</Text>
                        </Pressable>
                    )}
                />
            </View>

            <FlatList
                data={resources}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resourceItem}
                        onPress={() => handleTestSelection(item.id, item.testCategory.name)}
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
            />

            <View style={styles.paginationContainer}>
                <Pressable
                    style={[styles.paginationButton, pageIndex === 1 && styles.disabledButton]}
                    onPress={() => setPageIndex(prev => Math.max(prev - 1, 1))}
                    disabled={pageIndex === 1}
                >
                    <Text style={styles.paginationText}>Back</Text>
                </Pressable>
                <Text style={styles.pageIndicator}>Page {pageIndex}</Text>
                <Pressable
                    style={[styles.paginationButton, pageIndex * pageSize >= totalCount && styles.disabledButton]}
                    onPress={() => setPageIndex(prev => prev + 1)}
                    disabled={pageIndex >= Math.ceil(totalCount / pageSize)}
                >
                    <Text style={styles.paginationText}>Next</Text>
                </Pressable>
            </View>
            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate('TestHistory')}
            >
                <Text style={styles.historyButtonText}>View Test History</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    resourceItem: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10, marginVertical: 8, elevation: 3 },
    resourceTextContainer: { padding: 10 },
    resourceTitle: { fontSize: 16, fontWeight: 'bold' },
    resourceDescription: { fontSize: 14, color: '#666' },
    categoryButton: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    selectedCategory: {
        backgroundColor: '#007bff',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    historyItem: { padding: 10, backgroundColor: '#e3f2fd', borderRadius: 10, marginVertical: 5 },
    historyText: { fontSize: 16, color: '#333' },
    clearButton: { backgroundColor: 'red', padding: 10, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
    clearButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    paginationButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
    paginationText: { color: '#fff', fontSize: 16 },
    pageIndicator: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    disabledButton: { backgroundColor: '#ccc' },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10
    },
    categoryContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    categoryButton: { padding: 10, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#eee' },
    selectedCategory: { backgroundColor: '#007bff' },
    historyButton: { backgroundColor: '#17A2B8', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    historyButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
};

export default ResourceScreen;