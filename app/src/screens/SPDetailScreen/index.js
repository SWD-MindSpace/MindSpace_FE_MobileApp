import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from '@/app/src/config/config';

const SPDetailScreen = ({ route }) => {
    const { programId } = route.params;
    const [program, setProgram] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const programApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/${programId}`;
    const profileApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/profile`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("authToken");
                if (!accessToken) {
                    Alert.alert("Error", "Authentication required. Please log in.");
                    navigation.navigate("LoginScreen");
                    return;
                }

                const [programRes, profileRes] = await Promise.all([
                    fetch(programApiURL),
                    fetch(profileApiURL, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    })
                ]);

                if (!programRes.ok) throw new Error("Failed to fetch program details");
                if (profileRes.status === 401) {
                    Alert.alert("Session Expired", "Please log in again.");
                    navigation.navigate("LoginScreen");
                    return;
                }
                if (!profileRes.ok) throw new Error("Failed to fetch profile data");

                const [programData, profileData] = await Promise.all([
                    programRes.json(),
                    profileRes.json(),
                ]);

                setProgram(programData);
                setProfileData(profileData);
            } catch (error) {
                Alert.alert("Error", error.message);
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading details...</Text>
            </View>
        );
    }

    if (!program || !profileData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load details.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: program.thumbnailUrl }} style={styles.thumbnail} />

            <View style={styles.card}>
                <Text style={styles.title}>{program.city || "No City Info"}</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.text}><Text style={styles.label}>Street:</Text> {program.street || "N/A"}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Postal Code:</Text> {program.postalCode || "N/A"}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Max Quantity:</Text> {program.maxQuantity}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Active Status:</Text> {program.isActive ? "Active" : "Inactive"}</Text>
                    <Text style={styles.text}><Text style={styles.label}>Start Date:</Text> {new Date(program.startDateAt).toDateString()}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate("SignUpSPScreen", { program, profileData })}
            >
                <Text style={styles.buttonText}>Sign Up for Program</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SPDetailScreen;

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: "#F8F9FA", 
        padding: 16, 
        alignItems: "center",
    },
    loadingContainer: { 
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
    thumbnail: { 
        width: "100%", 
        height: 220, 
        borderRadius: 15, 
        marginBottom: 16, 
        resizeMode: "cover" 
    },
    card: { 
        backgroundColor: "#FFF", 
        padding: 20, 
        borderRadius: 12, 
        width: "100%", 
        elevation: 4, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 3 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 4, 
        marginBottom: 20 
    },
    title: { 
        fontSize: 22, 
        fontWeight: "bold", 
        marginBottom: 12, 
        color: "#333", 
        textAlign: "center" 
    },
    detailsContainer: { 
        marginTop: 8 
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
        paddingVertical: 14, 
        paddingHorizontal: 24, 
        borderRadius: 25, 
        width: "80%", 
        alignItems: "center", 
        elevation: 3, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 3 
    },
    buttonText: { 
        fontSize: 18, 
        color: "#FFF", 
        fontWeight: "bold" 
    }
});
