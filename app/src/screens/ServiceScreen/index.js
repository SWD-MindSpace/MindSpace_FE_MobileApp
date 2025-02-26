import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ServiceScreen = () => {
    const [programs, setPrograms] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetch("http://192.168.101.2:5021/api/v1/supporting-programs")
            .then((response) => response.json())
            .then((data) => setPrograms(data.data))
            .catch((error) => console.error("Error fetching programs:", error));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Available Supporting Programs</Text>

            {/* List of Programs */}
            <FlatList
                data={programs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("SPDetailScreen", { programId: item.id })}
                    >
                        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>{item.city}</Text>
                            <Text style={styles.address}>{item.street}</Text>
                            <Text style={styles.date}>Start Date: {new Date(item.startDateAt).toDateString()}</Text>
                        </View>
                        <Text style={styles.quantity}>{item.maxQuantity} left</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ServiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    address: {
        fontSize: 14,
        color: "#666",
        marginVertical: 4,
    },
    date: {
        fontSize: 12,
        color: "#888",
    },
    quantity: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#007AFF",
    },
});
