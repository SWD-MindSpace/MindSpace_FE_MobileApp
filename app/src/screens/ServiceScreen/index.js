import React, { useEffect, useState } from "react";
import {
    StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePrograms from "@/app/Services/Features/SupProgram/usePrograms";
import { jwtDecode } from "jwt-decode";
import CONFIG from "@/app/Services/Configs/config";

const ServiceScreen = () => {
    const navigation = useNavigation();
    const { programs, loading, error } = usePrograms(null);
    const [supportingProgramImages, setSupportingProgramImages] = useState({});
    const [userRole, setUserRole] = useState(null);
    const [signedUpPrograms, setSignedUpPrograms] = useState(new Set());

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

        const fetchSignedUpPrograms = async () => {
            try {
                const authToken = await AsyncStorage.getItem("authToken");
                if (!authToken) {
                    console.error("No authToken found.");
                    return;
                }

                const decodedToken = jwtDecode(authToken);
                const studentId = decodedToken?.sub; // Extract 'sub' as studentId

                if (!studentId) {
                    console.error("Student ID not found in token.");
                    return;
                }

                const response = await fetch(
                    `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/history?StudentId=${studentId}&SuportingProgramId=&JoinedAtForm&JoinedAtTo&Sort=joinedAtAsc`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${authToken}`,
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch signed-up programs. Status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Signed-up Programs:", result);

                if (result.data && Array.isArray(result.data)) {
                    const signedUpIds = new Set(result.data.map(item => item.id));
                    setSignedUpPrograms(signedUpIds);
                }
            } catch (error) {
                console.error("Error fetching signed-up programs:", error);
            }
        };

        fetchUserRole();
        fetchImages();
        fetchSignedUpPrograms();
    }, []);

    const handleUnregister = async (programId) => {
        try {
            const authToken = await AsyncStorage.getItem("authToken");

            const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/unregister`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: 1,
                    supportingProgramId: programId
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to unregister. Status: ${response.status}`);
            }

            Alert.alert("Success", "You have been unregistered from the program.");
            setSignedUpPrograms(prev => {
                const newSet = new Set(prev);
                newSet.delete(programId);
                return newSet;
            });
        } catch (error) {
            console.error("Error unregistering from program:", error);
            Alert.alert("Error", "Could not unregister. Please try again.");
        }
    };

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
                        style={[
                            styles.card,
                            !program.isActive && styles.inactiveCard,
                            signedUpPrograms.has(program.id) && styles.disabledCard,
                        ]}
                        onPress={() => {
                            if (userRole === "parent") {
                                Alert.alert("Access Denied", "Parents cannot sign up for programs.");
                                return;
                            }
                            navigation.navigate("SPDetailScreen", { programId: program.id });
                        }}
                        disabled={!program.isActive || userRole === "parent" || signedUpPrograms.has(program.id)}
                    >
                        <Image
                            source={{ uri: supportingProgramImages[program.id] }}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{program.title || "No title"}</Text>
                            <Text style={styles.details}> {program.street || "No street info"}</Text>
                            <Text style={styles.details}> {program.city || "N/A"}</Text>
                            <Text style={styles.details}> Max Quantity: {program.maxQuantity}</Text>
                            <Text style={styles.startDate}> Start Date: {program.startDateAt}</Text>
                            {signedUpPrograms.has(program.id) && <Text style={styles.signedUpText}>Signed Up</Text>}
                            {!program.isActive && <Text style={styles.inactiveText}>Inactive</Text>}
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noDataText}>No programs available.</Text>
            )}

            <Text style={styles.header}>Your Signed Up Programs</Text>
            {[...signedUpPrograms].length > 0 ? (
                programs.filter(program => signedUpPrograms.has(program.id)).map((program) => (
                    <View key={program.id} style={[styles.card, styles.signedUpCard]}>
                        <Image
                            source={{ uri: supportingProgramImages[program.id] }}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{program.title || "No title"}</Text>
                            <Text style={styles.details}> {program.street || "No street info"}</Text>
                            <Text style={styles.details}> {program.city || "N/A"}</Text>
                        </View>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => handleUnregister(program.id)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>You have not signed up for any programs.</Text>
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
    disabledCard: {
        opacity: 0.5,
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
    signedUpText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#28A745",
    },
    inactiveText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red",
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
    cancelButton: {
        backgroundColor: "red",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    cancelButton: {
        backgroundColor: "red",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default ServiceScreen;



