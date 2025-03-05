import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, ScrollView, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "@/app/src/config/config";
import { useNavigation } from "@react-navigation/native";

const SignUpSPScreen = ({ route }) => {
    const { program } = route.params;
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const profileApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/profile`;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("authToken");
                if (!accessToken) {
                    Alert.alert("Error", "No authentication token found. Please log in again.");
                    navigation.navigate("LoginScreen");
                    return;
                }

                const response = await fetch(profileApiURL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: Unable to fetch profile`);
                }

                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                Alert.alert("Error", error.message);
                console.error("Profile fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmit = () => {
        Alert.alert("Success", "You have successfully signed up for the program!");
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Loading profile...</Text>
            </View>
        );
    }

    if (!profileData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load profile data.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Confirm Your Sign-Up</Text>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>User Profile</Text>
                <Text style={styles.text}><Text style={styles.label}>Full Name:</Text> {profileData.fullName}</Text>
                <Text style={styles.text}><Text style={styles.label}>Email:</Text> {profileData.email}</Text>
                <Text style={styles.text}><Text style={styles.label}>Username:</Text> {profileData.userName}</Text>
                <Text style={styles.text}><Text style={styles.label}>Date of Birth:</Text> {profileData.dateOfBirth}</Text>
                <Text style={styles.text}><Text style={styles.label}>Phone Number:</Text> {profileData.phoneNumber || "N/A"}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Program Details</Text>
                <Text style={styles.text}><Text style={styles.label}>City:</Text> {program.city || "No City Info"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Street:</Text> {program.street || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Postal Code:</Text> {program.postalCode || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Max Quantity:</Text> {program.maxQuantity}</Text>
                <Text style={styles.text}><Text style={styles.label}>Active Status:</Text> {program.isActive ? "Active" : "Inactive"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Start Date:</Text> {new Date(program.startDateAt).toDateString()}</Text>
            </View>

            <Button title="Confirm Sign-Up" onPress={handleSubmit} color="#007AFF" />
        </ScrollView>
    );
};

export default SignUpSPScreen;

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, alignItems: "center", backgroundColor: "#F8F9FA" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    card: { backgroundColor: "#FFF", padding: 15, borderRadius: 10, width: "100%", marginBottom: 15, elevation: 3 },
    sectionHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    text: { fontSize: 16, color: "#555", marginBottom: 5 },
    label: { fontWeight: "bold", color: "#000" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorText: { fontSize: 18, color: "red" },
});
