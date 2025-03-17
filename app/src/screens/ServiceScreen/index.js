import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetchPrograms from "@/app/Services/Features/SupProgram/useFetchPrograms";
import CONFIG from '@/app/Services/Configs/config';

const ServiceScreen = () => {
    const navigation = useNavigation();
    const { programs, loading, error, setPrograms } = useFetchPrograms();
    const [quantities, setQuantities] = useState({});
    const [signedUpPrograms, setSignedUpPrograms] = useState([]);

    useEffect(() => {
        const loadSignedUpPrograms = async () => {
            try {
                const storedServices = await AsyncStorage.getItem("signedUpPrograms");
                if (storedServices) {
                    const services = JSON.parse(storedServices);
                    setSignedUpPrograms(services); // Store the entire program object
                }
            } catch (error) {
                console.error("Error loading signed-up programs:", error);
            }
        };

        loadSignedUpPrograms();
    }, []);

    useEffect(() => {
        const loadProgramQuantities = async () => {
            try {
                const storedQuantities = await AsyncStorage.getItem("programQuantities");
                if (storedQuantities) {
                    const parsedQuantities = JSON.parse(storedQuantities);
                    setQuantities(parsedQuantities); // Set quantities to state

                    const updatedPrograms = programs.map(program => {
                        const newQuantity = parsedQuantities[program.id] || 0; // Default to 0 if no quantity found
                        return { ...program, maxQuantity: newQuantity };
                    });

                    // Only update if the programs list has changed
                    if (JSON.stringify(updatedPrograms) !== JSON.stringify(programs)) {
                        setPrograms(updatedPrograms);
                    }
                }
            } catch (error) {
                console.error("Error loading program quantities:", error);
            }
        };

        loadProgramQuantities();
    }, [programs]);

    const handleCancel = async (programId) => {
        Alert.alert(
            "Cancel Program",
            "Are you sure you want to cancel your registration for this program?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            // Update quantities and signed-up programs state
                            const updatedQuantities = { ...quantities };
                            updatedQuantities[programId] += 1; // Increase quantity
                            setQuantities(updatedQuantities);

                            // Remove the program from signed-up programs
                            const updatedServices = signedUpPrograms.filter((id) => id !== programId);
                            setSignedUpPrograms(updatedServices);

                            // Save updated state to AsyncStorage
                            await AsyncStorage.setItem("programQuantities", JSON.stringify(updatedQuantities));
                            await AsyncStorage.setItem("signedUpPrograms", JSON.stringify(updatedServices));

                            Alert.alert("Success", "You have successfully canceled your registration.");
                        } catch (error) {
                            console.error("Error canceling program:", error);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Failed to load programs. Please try again later.</Text>;
    }

    return (
        <FlatList
            data={programs}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
                <View style={styles.container}>
                    <Text style={styles.headerText}>Available Supporting Programs</Text>
                </View>
            }
            renderItem={({ item }) => {
                const isSignedUp = signedUpPrograms.includes(item.id);
                const quantityLeft = quantities[item.id] || 0; // Use quantities state to get current available quantity

                return (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("SPDetailScreen", { programId: item.id, isSignedUp })}
                        disabled={isSignedUp || quantityLeft <= 0} // Disable if signed up or out of stock
                    >
                        <Image
                            source={{ uri: item.cloudinaryImageUrl || "https://via.placeholder.com/80" }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>{item.city}</Text>
                            <Text style={styles.address}>{item.street}</Text>
                            <Text style={styles.date}>Start Date: {new Date(item.startDateAt).toDateString()}</Text>
                        </View>
                        <Text style={styles.quantity}>
                            {isSignedUp
                                ? "Already Signed Up"
                                : (quantityLeft > 0 ? `${quantityLeft} left` : "Out of stock")}
                        </Text>
                    </TouchableOpacity>
                );
            }}
            ListFooterComponent={
                <View style={styles.container}>
                    <Text style={styles.headerText}>Your Signed-Up Programs</Text>
                    {signedUpPrograms.length > 0 ? (
                        signedUpPrograms.map((programId) => {
                            const program = programs.find((prog) => prog.id === programId);
                            return (
                                program && (
                                    <View key={program.id}>
                                        <TouchableOpacity
                                            style={styles.card}
                                            onPress={() => navigation.navigate("SPDetailScreen", { programId: program.id })} // Navigate to SPDetailScreen
                                        >
                                            <Image
                                                source={{ uri: program.cloudinaryImageUrl || "https://via.placeholder.com/80" }}
                                                style={styles.thumbnail}
                                            />
                                            <View style={styles.cardContent}>
                                                <Text style={styles.title}>{program.city}</Text>
                                                <Text style={styles.address}>{program.street}</Text>
                                                <Text style={styles.date}>Start Date: {new Date(program.startDateAt).toDateString()}</Text>
                                            </View>
                                            <Text style={styles.quantity}>Signed Up</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => handleCancel(program.id)}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            );
                        })
                    ) : (
                        <Text style={styles.noServicesText}>You have not signed up for any programs yet.</Text>
                    )}
                </View>
            }
        />
    );
};

export default ServiceScreen;

const styles = StyleSheet.create({
    container: {
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
    noServicesText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginVertical: 20,
    },
    cancelButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: "center",
    },
    cancelButtonText: {
        color: "#FFF",
        fontWeight: "bold",
    },
});
