import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, Image, TouchableOpacity, Linking, ActivityIndicator, Button
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from '@/app/src/config/config';

const SPDetailScreen = ({ route }) => {
    const { programId } = route.params;
    const [program, setProgram] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const navigation = useNavigation();

    const programApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/${programId}`;
    const profileApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/profile`;

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("authToken");
                if (accessToken) {
                    setToken(accessToken);
                } else {
                    console.error("No access token found.");
                }
            } catch (error) {
                console.error("Error retrieving token:", error);
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchProgramDetails = async () => {
            try {
                const response = await fetch(programApiURL);
                const data = await response.json();
                setProgram(data);
            } catch (error) {
                console.error("Error fetching program details:", error);
            }
        };

        const fetchUserProfile = async () => {
            try {
                const response = await fetch(profileApiURL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    console.error("Unauthorized! Token might be expired or invalid.");
                    return;
                }

                if (!response.ok) {
                    console.error(`Error: ${response.status} ${response.statusText}`);
                    return;
                }

                const profile = await response.json();
                setProfileData(profile);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        Promise.all([fetchProgramDetails(), fetchUserProfile()]).then(() => setLoading(false));
    }, [token]);

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
        <View style={styles.container}>
            <Image source={{ uri: program.thumbnailUrl }} style={styles.thumbnail} />

            <View style={styles.card}>
                <Text style={styles.title}>{program.city || "No City Info"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Street:</Text> {program.street || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Postal Code:</Text> {program.postalCode || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Max Quantity:</Text> {program.maxQuantity}</Text>
                <Text style={styles.text}><Text style={styles.label}>Active Status:</Text> {program.isActive ? "Active" : "Inactive"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Start Date:</Text> {new Date(program.startDateAt).toDateString()}</Text>
            </View>

            <Button
                title="Sign Up for Program"
                onPress={() => navigation.navigate("SignUpSPScreen", { program, profileData })}
                color="#007AFF"
            />
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
    thumbnail: {
        width: "90%",
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    text: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
    },
    label: {
        fontWeight: "bold",
        color: "#000",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold",
    },
});