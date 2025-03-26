import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePrograms from "@/app/Services/Features/SupProgram/usePrograms";
import { jwtDecode } from "jwt-decode";
import CONFIG from '@/app/Services/Configs/config';

const ServiceScreen = () => {
    const navigation = useNavigation();
    const { programs, loading, error } = usePrograms(null);
    const [supportingProgramImages, setSupportingProgramImages] = useState({});
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const role = decodedToken?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    setUserRole(role || null);
                }
            } catch (error) {
                console.error("Error decoding authToken:", error);
            }
        };

        const fetchImages = async () => {
            try {
                const storedImages = await AsyncStorage.getItem("supportingProgramImages");
                setSupportingProgramImages(storedImages ? JSON.parse(storedImages) : {});
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchUserRole();
        fetchImages();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Available Supporting Programs</Text>
            {programs.length > 0 ? (
                programs.map((program) => (
                    <TouchableOpacity
                        key={program.id}
                        style={[styles.card, !program.isActive && styles.inactiveCard]}
                        onPress={() => {
                            if (userRole === "parent") {
                                Alert.alert("Access Denied", "Parents cannot sign up for programs.");
                                return;
                            }
                            navigation.navigate("SPDetailScreen", { programId: program.id });
                        }}
                        disabled={!program.isActive || userRole === "parent"}
                    >
                        <Image
                            source={{ uri: supportingProgramImages[program.id] || "https://via.placeholder.com/150" }}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{program.title}</Text>
                            <Text style={styles.details}> {program.street || "No street info"}</Text>
                            <Text style={styles.details}> {program.city || "N/A"}</Text>
                            <Text style={styles.details}> Max Quantity: {program.maxQuantity}</Text>
                            <Text style={styles.startDate}> Start Date: {program.startDateAt}</Text>
                            {!program.isActive && <Text style={styles.inactiveText}>Inactive</Text>}
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noDataText}>No programs available.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F4F6F9",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
        textAlign: "center",
        marginBottom: 15,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        marginBottom: 15,
        elevation: 4,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    details: {
        fontSize: 16,
        color: "#555",
    },
    startDate: {
        fontSize: 14,
        fontStyle: "italic",
        color: "#007AFF",
    },
    noDataText: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        marginVertical: 10,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
});

export default ServiceScreen;
