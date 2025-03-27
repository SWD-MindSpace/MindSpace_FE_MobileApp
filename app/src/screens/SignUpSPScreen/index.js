import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, Button, ScrollView, Alert, ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePrograms from "@/app/Services/Features/SupProgram/usePrograms";
import { jwtDecode } from "jwt-decode";
import CONFIG from '@/app/Services/Configs/config';

const SignUpSPScreen = ({ route }) => {
    const navigation = useNavigation();
    const programId = Number(route.params?.programId);
    console.log("🔹 Received programId:", programId);

    if (!programId || isNaN(programId) || programId <= 0) {
        Alert.alert("Error", "Invalid program ID.");
        return null;
    }

    const { program, profile, loading, error } = usePrograms(programId);
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async () => {
        try {
            setUpdating(true);
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
                Alert.alert("Error", "User not authenticated.");
                return;
            }

            const decodedToken = jwtDecode(token);
            const studentId = decodedToken?.sub;
            if (!studentId) {
                Alert.alert("Error", "Invalid session.");
                return;
            }

            console.log("🔹 Student ID:", studentId);
            console.log("🔹 Program ID:", programId);

            const url = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/register`;
            console.log("🟢 Sending POST request to:", url);

            const requestBody = JSON.stringify({
                studentId: studentId,
                supportingProgramId: programId,
            });
            console.log("📩 Request Body:", requestBody);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: requestBody,
            });

            console.log("🔵 Response Status:", response.status);

            if (response.status === 204) {
                // Retrieve existing sign-ups
                const existingSignups = await AsyncStorage.getItem("signedUpPrograms");
                const signedUpPrograms = existingSignups ? JSON.parse(existingSignups) : [];

                // Check if the student has already signed up for this program
                const alreadySignedUp = signedUpPrograms.some(
                    (entry) => entry.programId === programId && entry.studentId === studentId
                );

                if (!alreadySignedUp) {
                    // Store both programId and studentId as an object
                    signedUpPrograms.push({ programId, studentId });
                    await AsyncStorage.setItem("signedUpPrograms", JSON.stringify(signedUpPrograms));
                }

                Alert.alert("Success", "You have successfully signed up!");
                navigation.navigate("MainScreen", { screen: "Service" });
            } else {
                throw new Error(`Failed to register. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("🔴 Error in handleSubmit:", error);
            Alert.alert("Error", error.message || "Something went wrong.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error loading program details. Please try again.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {profile && (
                <>
                    <Avatar.Image
                        size={100}
                        source={{ uri: profile.avatarUrl || 'https://via.placeholder.com/100' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.profileName}>{profile.fullName || "N/A"}</Text>
                    <Text style={styles.profileEmail}>{profile.email || "N/A"}</Text>
                </>
            )}

            {program && (
                <View style={styles.card}>
                    <Text style={styles.sectionHeader}>Program Details</Text>
                    <ProfileDetail label="City" value={program.city || "No City Info"} />
                    <ProfileDetail label="Street" value={program.street || "N/A"} />
                    <ProfileDetail label="Postal Code" value={program.postalCode || "N/A"} />
                    <ProfileDetail label="Max Quantity" value={program.maxQuantity} />
                    <ProfileDetail label="Active Status" value={program.isActive ? "Active" : "Inactive"} />
                    <ProfileDetail label="Start Date" value={program.startDateAt ? new Date(program.startDateAt).toDateString() : "N/A"} />
                </View>
            )}

            <Button
                title={updating ? "Signing Up..." : "Confirm Sign-Up"}
                onPress={handleSubmit}
                color="#007AFF"
                disabled={updating}
            />
        </ScrollView>
    );
};

const ProfileDetail = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export default SignUpSPScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: "#F4F6F9"
    },
    errorText: {
        fontSize: 18,
        color: "red"
    },
    avatar: {
        marginBottom: 15
    },
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
        textAlign: "center"
    },
    profileEmail: {
        fontSize: 16,
        color: "#555",
        marginBottom: 15,
        textAlign: "center"
    },
    card: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        marginBottom: 15,
        elevation: 3
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333"
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0"
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },
    value: {
        fontSize: 16,
        color: "#007AFF"
    }
});
