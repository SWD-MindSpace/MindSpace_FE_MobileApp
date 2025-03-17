import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProgramDetail from "@/app/Services/Features/SupProgram/useProgramDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SPDetailScreen = ({ route }) => {
    const { programId, signedUpPrograms = [] } = route.params;  // Default to empty array if undefined
    const navigation = useNavigation();

    const { program, loading, error } = useProgramDetail(programId);
    const [isSignedUp, setIsSignedUp] = useState(false);

    // Check if user is signed up for the program from AsyncStorage
    useEffect(() => {
        const checkIfSignedUp = async () => {
            const signedUpPrograms = await AsyncStorage.getItem("signedUpPrograms");
            const programs = signedUpPrograms ? JSON.parse(signedUpPrograms) : [];
            setIsSignedUp(programs.includes(programId));
        };

        checkIfSignedUp();
    }, [programId]);

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading program details...</Text>
            </View>
        );
    }

    if (error) {
        Alert.alert("Error", "Failed to fetch program details.", [{ text: "OK", onPress: () => navigation.goBack() }]);
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>Something went wrong.</Text>
            </View>
        );
    }

    if (!program) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>Program details not available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: program.imageUrl }} style={styles.image} />

            <View style={styles.card}>
                <Text style={styles.title}>{program.city || "Unknown Location"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Street:</Text> {program.street || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Postal Code:</Text> {program.postalCode || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Max Quantity:</Text> {program.maxQuantity}</Text>
                <Text style={styles.text}><Text style={styles.label}>Status:</Text> {program.isActive ? "Active" : "Inactive"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Start Date:</Text> {new Date(program.startDateAt).toDateString()}</Text>
            </View>

            {/* Render the Sign Up button only if the user is not signed up */}
            {!isSignedUp && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("SignUpSPScreen", { programId })}
                >
                    <Text style={styles.buttonText}>Sign Up for Program</Text>
                </TouchableOpacity>
            )}

        </View>
    );
};



export default SPDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        fontSize: 16,
        color: "#666"
    },
    errorText: {
        fontSize: 18,
        color: "red"
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 15,
        marginBottom: 15,
        resizeMode: "cover"
    },
    card: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        width: "90%",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: "center"
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
        textAlign: "center"
    },
    text: {
        fontSize: 16,
        color: "#555",
        marginBottom: 6
    },
    label: {
        fontWeight: "bold",
        color: "#000"
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        width: "70%",
        alignItems: "center",
        marginTop: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3
    },
    buttonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold"
    }
});
