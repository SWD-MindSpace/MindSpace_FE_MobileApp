import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, Button, ScrollView, Alert, ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePrograms from "@/app/Services/Features/SupProgram/usePrograms";
import { useUserRole } from "@/app/Services/context/userRoleContext";

const SignUpSPScreen = ({ route }) => {
    const navigation = useNavigation();
    const { userRole } = useUserRole(); // Get userRole from context

    // Ensure programId is properly retrieved
    const programId = Number(route.params?.programId);
    console.log("🔹 Received programId:", programId);

    if (!programId || isNaN(programId) || programId <= 0) {
        Alert.alert("Error", "Invalid program ID.");
        return null;  // Prevent rendering if the ID is invalid
    }

    const { program, profile, loading, error } = usePrograms(programId, userRole);
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async () => {
        console.log("🚀 Submitting request for programId:", programId);

        if (!programId || isNaN(programId) || programId <= 0) {
            Alert.alert("Error", "Invalid program ID.");
            console.error("❌ Invalid programId before update:", programId);
            return;
        }

        try {
            // Get current signed-up programs
            let signedUpPrograms = await AsyncStorage.getItem("signedUpPrograms");
            signedUpPrograms = signedUpPrograms ? JSON.parse(signedUpPrograms) : [];

            // Check if the program has already been signed up for
            if (signedUpPrograms.includes(programId)) {
                Alert.alert("Already Signed Up", "You have already signed up for this program.");
                return; // Prevent further action if already signed up
            }

            // Update program locally (decrease maxQuantity)
            const newProgram = { ...program, maxQuantity: Math.max((program.maxQuantity ?? 0) - 1, 0) };
            console.log("📤 Updated program locally:", JSON.stringify(newProgram, null, 2));

            // Store the updated program and maxQuantity in AsyncStorage
            await AsyncStorage.getItem("programQuantities").then(async (storedQuantities) => {
                const quantities = storedQuantities ? JSON.parse(storedQuantities) : {};
                quantities[programId] = newProgram.maxQuantity;

                // Update both 'programQuantities' and 'yourServices'
                await AsyncStorage.multiSet([
                    ["programQuantities", JSON.stringify(quantities)],
                    ["yourServices", JSON.stringify([{ id: programId, ...newProgram }])]
                ]);
            });

            // Save the programId in signedUpPrograms
            signedUpPrograms.push(programId);
            await AsyncStorage.setItem("signedUpPrograms", JSON.stringify(signedUpPrograms));

            Alert.alert("Success", "You have successfully signed up for the program!");

            // Navigate to the ServiceScreen to reflect updated quantity
            navigation.navigate("MainScreen", { screen: "Service" });

        } catch (error) {
            console.error("Error signing up for program:", error);
            Alert.alert("Error", "Something went wrong. Please try again later.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error loading program details. Please try again.</Text>;
    }

    const programExists = program && Object.keys(program).length > 0;
    const profileExists = profile && Object.keys(profile).length > 0;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {profileExists ? (
                <>
                    <Avatar.Image
                        size={100}
                        source={{ uri: profile.avatarUrl || 'https://via.placeholder.com/100' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.profileName}>{profile.fullName || "N/A"}</Text>
                    <Text style={styles.profileEmail}>{profile.email || "N/A"}</Text>
                </>
            ) : <Text>No Profile Found</Text>}

            {programExists ? (
                <View style={styles.card}>
                    <Text style={styles.sectionHeader}>Program Details</Text>
                    <ProfileDetail label="City" value={program.city || "No City Info"} />
                    <ProfileDetail label="Street" value={program.street || "N/A"} />
                    <ProfileDetail label="Postal Code" value={program.postalCode || "N/A"} />
                    <ProfileDetail label="Max Quantity" value={program.maxQuantity} />
                    <ProfileDetail label="Active Status" value={program.isActive ? "Active" : "Inactive"} />
                    <ProfileDetail label="Start Date" value={program.startDateAt ? new Date(program.startDateAt).toDateString() : "N/A"} />
                </View>
            ) : <Text>No Program Details Available</Text>}

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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
        color: "#555",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
