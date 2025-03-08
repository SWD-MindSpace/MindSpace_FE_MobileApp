import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, ScrollView, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "@/app/src/config/config";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";

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
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!profileData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load profile data.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* User Avatar & Name */}
            <Avatar.Image 
                size={100} 
                source={{ uri: 'https://via.placeholder.com/100' }} 
                style={styles.avatar}
            />
            <Text style={styles.profileName}>{profileData.fullName}</Text>
            <Text style={styles.profileEmail}>{profileData.email}</Text>

            {/* User Profile Card */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>User Profile</Text>
                <ProfileDetail label="Username" value={profileData.userName} />
                <ProfileDetail label="Date of Birth" value={profileData.dateOfBirth} />
                <ProfileDetail label="Phone Number" value={profileData.phoneNumber || "N/A"} />
            </View>

            {/* Program Details Card */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Program Details</Text>
                <ProfileDetail label="City" value={program.city || "No City Info"} />
                <ProfileDetail label="Street" value={program.street || "N/A"} />
                <ProfileDetail label="Postal Code" value={program.postalCode || "N/A"} />
                <ProfileDetail label="Max Quantity" value={program.maxQuantity} />
                <ProfileDetail label="Active Status" value={program.isActive ? "Active" : "Inactive"} />
                <ProfileDetail label="Start Date" value={new Date(program.startDateAt).toDateString()} />
            </View>

            {/* Sign-Up Button */}
            <Button title="Confirm Sign-Up" onPress={handleSubmit} color="#007AFF" />
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
