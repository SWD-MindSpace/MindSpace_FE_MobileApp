import React from "react";
import {
    StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useProgramDetail from "@/app/Services/Features/SupProgram/useProgramDetail";

const SPDetailScreen = ({ route }) => {
    const { programId } = route.params;
    const navigation = useNavigation();
    const { program, profileData, loading, error } = useProgramDetail(programId);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading details...</Text>
            </View>
        );
    }

    if (error) {
        Alert.alert("Error", error, [{ text: "OK", onPress: () => navigation.goBack() }]);
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
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
