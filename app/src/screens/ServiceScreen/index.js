import React from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import usePrograms from "@/app/Services/Features/SupProgram/usePrograms";

const ServiceScreen = () => {
    const navigation = useNavigation();
    const { programs, loading, error } = usePrograms();

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Failed to load programs. Please try again later.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Available Supporting Programs</Text>

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
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
});