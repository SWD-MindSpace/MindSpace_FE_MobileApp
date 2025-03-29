import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProgramDetail from "@/app/Services/Features/SupProgram/useProgramDetail";
import CONFIG from '@/app/Services/Configs/config';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SPDetailScreen = ({ route }) => {
    const { programId } = route.params;
    const navigation = useNavigation();
    const { program, loading, error } = useProgramDetail(programId);
    const [isSignedUp, setIsSignedUp] = useState(false);

    useEffect(() => {
        const checkIfSignedUp = async () => {
            try {
                const authToken = await AsyncStorage.getItem("authToken");
        
                const response = await fetch(
                    `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/history?StudentId=1&SuportingProgramId=&JoinedAtForm&JoinedAtTo&Sort=joinedAtAsc`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );
        
                if (!response.ok) {
                    throw new Error(`Failed to fetch signed-up programs. Status: ${response.status}`);
                }
        
                const result = await response.json(); // Convert response to JSON
        
                console.log("API Response:", result);
        
                // Ensure result.data is an array before calling .some()
                if (result.data && Array.isArray(result.data)) {
                    const signedUp = result.data.some(item => item.id === programId);
                    setIsSignedUp(signedUp);
                } else {
                    console.error("Unexpected API response format. Expected an array in 'data':", result);
                }
            } catch (err) {
                console.error("Error fetching signed-up programs:", err);
            }
        };        
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
        return <View style={styles.centeredContainer}><Text style={styles.errorText}>Something went wrong.</Text></View>;
    }

    if (!program) {
        return <View style={styles.centeredContainer}><Text style={styles.errorText}>Program details not available.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: program.imageUrl }} style={styles.image} />
            <View style={styles.card}>
                <Text style={styles.title}>{program.city || "Unknown Location"}</Text>
                {[
                    ["Street", program.street || "N/A"],
                    ["Postal Code", program.postalCode || "N/A"],
                    ["Max Quantity", program.maxQuantity],
                    ["Status", program.isActive ? "Active" : "Inactive"],
                    ["Start Date", new Date(program.startDateAt).toDateString()]
                ].map(([label, value]) => (
                    <Text key={label} style={styles.text}>
                        <Text style={styles.label}>{label}:</Text> {value}
                    </Text>
                ))}
            </View>

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
    container: { flex: 1, backgroundColor: "#F8F9FA", padding: 16, alignItems: "center" },
    centeredContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { fontSize: 16, color: "#666" },
    errorText: { fontSize: 18, color: "red" },
    image: { width: "100%", height: 200, borderRadius: 15, marginBottom: 15, resizeMode: "cover" },
    card: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, width: "90%", elevation: 4, alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333", textAlign: "center" },
    text: { fontSize: 16, color: "#555", marginBottom: 6 },
    label: { fontWeight: "bold", color: "#000" },
    button: { backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 25, width: "70%", alignItems: "center", marginTop: 20 },
    buttonText: { fontSize: 16, color: "#FFF", fontWeight: "bold" }
});
