import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useTests from '@/app/Services/Features/Test/useTests';

const ResourceScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;

    const { tests, categories, loading, totalCount, error } = useTests(pageIndex, pageSize, selectedCategory);

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = pageIndex < totalPages;
    const hasPrevPage = pageIndex > 1;

    const handleNextPage = () => {
        if (hasNextPage) {
            setPageIndex(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (hasPrevPage) {
            setPageIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    if (error) {
        return <Text style={{ textAlign: 'center', color: 'red' }}>Error loading tests. Please try again later.</Text>;
    }

    // Filter tests by the targetUser
    const filteredTests = tests.filter(test => {
        console.log(test.targetUser);  // Log the targetUser for each test
        return test.targetUser === 'Student' || test.targetUser === 'Parent';
    });


    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
            <Text style={styles.sectionHeader}>Available Tests</Text>

            {/* Category Filter */}
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
                                selectedCategory === item && styles.selectedCategory,
                            ]}
                            onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
                        >
                            <Text style={styles.categoryText}>{item}</Text>
                        </Pressable>
                    )}
                />
            </View>

            {/* Test List */}
            <FlatList
                data={filteredTests} // Use filtered tests
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resourceItem}
                        onPress={() => navigation.navigate('ResourceDetailScreen', { testId: item.id, testName: item.testCategory.name })}
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
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No tests available in this category.</Text>
                }
            />

            {/* Pagination */}
            <View style={styles.paginationContainer}>
                <Pressable
                    style={[styles.paginationButton, !hasPrevPage && styles.disabledButton]}
                    onPress={handlePrevPage}
                    disabled={!hasPrevPage}
                >
                    <Text style={styles.paginationText}>Back</Text>
                </Pressable>

                <Text style={styles.pageIndicator}>Page {pageIndex} of {totalPages}</Text>

                <Pressable
                    style={[styles.paginationButton, !hasNextPage && styles.disabledButton]}
                    onPress={handleNextPage}
                    disabled={!hasNextPage}
                >
                    <Text style={styles.paginationText}>Next</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = {
    sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    resourceItem: { padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10, marginVertical: 8, elevation: 3 },
    resourceTextContainer: { padding: 10 },
    resourceTitle: { fontSize: 16, fontWeight: 'bold' },
    resourceDescription: { fontSize: 14, color: '#666' },
    categoryButton: { padding: 10, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#eee' },
    selectedCategory: { backgroundColor: '#007bff' },
    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    paginationButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
    paginationText: { color: '#fff', fontSize: 16 },
    pageIndicator: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    disabledButton: { backgroundColor: '#ccc' },
    categoryContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
};

export default ResourceScreen;
