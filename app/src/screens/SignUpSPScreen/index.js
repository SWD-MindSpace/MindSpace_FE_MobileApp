import React from "react";
import { StyleSheet, Text, View, Button, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import usePrograms from "@/app/Services/Features/SupProgram/usePrograms";

const SignUpSPScreen = ({ route }) => {
    const { programId } = route.params;
    const { program, profile, loading, error } = usePrograms(programId);
    const navigation = useNavigation();

    const handleSubmit = () => {
        Alert.alert("Success", "You have successfully signed up for the program!");
        navigation.navigate('MainScreen', { screen: 'Service' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* User Avatar & Name */}
            <Avatar.Image
                size={100}
                source={{ uri: profile?.avatarUrl || 'https://via.placeholder.com/100' }}
                style={styles.avatar}
            />
            <Text style={styles.profileName}>{profile?.fullName || "N/A"}</Text>
            <Text style={styles.profileEmail}>{profile?.email || "N/A"}</Text>

            {/* User Profile Card */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>User Profile</Text>
                <ProfileDetail label="Username" value={profile?.userName} />
                <ProfileDetail label="Date of Birth" value={profile?.dateOfBirth} />
                <ProfileDetail label="Phone Number" value={profile?.phoneNumber || "N/A"} />
            </View>

            {/* Program Details Card */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Program Details</Text>
                <ProfileDetail label="City" value={program?.city || "No City Info"} />
                <ProfileDetail label="Street" value={program?.street || "N/A"} />
                <ProfileDetail label="Postal Code" value={program?.postalCode || "N/A"} />
                <ProfileDetail label="Max Quantity" value={program?.maxQuantity} />
                <ProfileDetail label="Active Status" value={program?.isActive ? "Active" : "Inactive"} />
                <ProfileDetail label="Start Date" value={program?.startDateAt ? new Date(program.startDateAt).toDateString() : "N/A"} />
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
