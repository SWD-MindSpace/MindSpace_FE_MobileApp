import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ResourceScreen = ({ navigation }) => {
    const resourceApiURL = "http://192.168.101.2:5021/api/v1/tests";
    const [resources, setResources] = useState([]);

    // Fetch Resources
    const getAllResources = async () => {
        try {
            const response = await fetch(resourceApiURL);
            const jsonData = await response.json();
            if (jsonData && jsonData.data) {
                setResources(jsonData.data);
            }
        } catch (error) {
            console.error("Error fetching resource data:", error);
        }
    };

    useEffect(() => {
        getAllResources();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>Available Tests</Text>
            <FlatList
                data={resources}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resourceItem}
                        onPress={() => navigation.navigate('ResourceDetailScreen', { testId: item.id })}
                    >
                        <View style={styles.resourceTextContainer}>
                            <Text style={styles.resourceTitle}>{item.title}</Text>
                            <Text style={styles.resourceDescription}>{item.description}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
                                <FontAwesome5 name="bullseye" size={20} color="red" solid />
                                <Text>Target: {item.targetUser}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
                                <FontAwesome5 name="question-circle" size={20} color="blue" solid />
                                <Text>Number of questions: {item.questionCount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ResourceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    resourceItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 8,
        overflow: 'hidden',
        elevation: 3
    },
    resourceImage: {
        width: 80,
        height: 80,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    resourceTextContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        gap: 5
    },
    resourceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    resourceDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4
    },
    resourceInfo: {
        fontSize: 12,
        color: '#888'
    },
});
