import React, { useState } from 'react';
import { FlatList, Text, View, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useTests from '@/app/Services/Features/Test/useTests';

const ResourceScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 5;

    const { tests, categories, loading, totalCount } = useTests(pageIndex, pageSize, selectedCategory);
    
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

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <Text style={styles.sectionHeader}>Available Tests</Text>

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
                data={tests}
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
            />

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
    categoryButton: { padding: 10, marginHorizontal: 5, borderRadius: 5, backgroundColor: '#eee' },
    selectedCategory: { backgroundColor: '#007bff' },
    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    paginationButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
    paginationText: { color: '#fff', fontSize: 16 },
    pageIndicator: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    disabledButton: { backgroundColor: '#ccc' },
    categoryContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    historyButton: { backgroundColor: '#17A2B8', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    historyButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
};

export default ResourceScreen;
