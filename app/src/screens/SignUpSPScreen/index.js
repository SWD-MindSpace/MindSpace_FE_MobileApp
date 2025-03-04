import React from "react";
import { StyleSheet, Text, View, Button, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignUpSPScreen = ({ route }) => {
    const { program, profileData } = route.params;
    const navigation = useNavigation();

    const handleSubmit = () => {
        Alert.alert("Success", "You have successfully signed up for the program!");
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Confirm Your Sign-Up</Text>

            {/* User Profile Information */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>User Profile</Text>
                <Text style={styles.text}><Text style={styles.label}>Full Name:</Text> {profileData.fullName}</Text>
                <Text style={styles.text}><Text style={styles.label}>Email:</Text> {profileData.email}</Text>
                <Text style={styles.text}><Text style={styles.label}>Username:</Text> {profileData.userName}</Text>
                <Text style={styles.text}><Text style={styles.label}>Date of Birth:</Text> {profileData.dateOfBirth}</Text>
                <Text style={styles.text}><Text style={styles.label}>Phone Number:</Text> {profileData.phoneNumber || "N/A"}</Text>
            </View>

            {/* Supporting Program Information */}
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Program Details</Text>
                <Text style={styles.text}><Text style={styles.label}>City:</Text> {program.city || "No City Info"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Street:</Text> {program.street || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Postal Code:</Text> {program.postalCode || "N/A"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Max Quantity:</Text> {program.maxQuantity}</Text>
                <Text style={styles.text}><Text style={styles.label}>Active Status:</Text> {program.isActive ? "Active" : "Inactive"}</Text>
                <Text style={styles.text}><Text style={styles.label}>Start Date:</Text> {new Date(program.startDateAt).toDateString()}</Text>
                <Text style={styles.text}><Text style={styles.label}>Program Description:</Text> {program.description || "No description available"}</Text>
            </View>

            <Button title="Confirm Sign-Up" onPress={handleSubmit} color="#007AFF" />
        </ScrollView>
    );
};

export default SignUpSPScreen;

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: "#F8F9FA", 
        padding: 16, 
        alignItems: "center" 
    },
    header: { 
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 20, 
        textAlign: "center" 
    },
    card: { 
        backgroundColor: "#FFF", 
        padding: 15, 
        borderRadius: 10, 
        width: "100%", 
        marginBottom: 15, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 5, 
        elevation: 3 
    },
    sectionHeader: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginBottom: 8 
    },
    text: { 
        fontSize: 16, 
        color: "#555", 
        marginBottom: 5 
    },
    label: { 
        fontWeight: "bold", 
        color: "#000" 
    },
});
