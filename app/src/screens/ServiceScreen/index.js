import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFetchPrograms from "@/app/Services/Features/SupProgram/useFetchPrograms";
import { jwtDecode } from "jwt-decode";
import CONFIG from "@/app/Services/Configs/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ServiceScreen = () => {
    const navigation = useNavigation();
    const { programs, loading, error } = useFetchPrograms();
    const [signedUpPrograms, setSignedUpPrograms] = useState([]);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        loadStudentId();
    }, []);

    useEffect(() => {
        if (studentId) {
            fetchProgramHistory(studentId);
        }
    }, [studentId]);

    const loadStudentId = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                const decodedToken = jwtDecode(token);
                const id = decodedToken?.sub;
                if (id) {
                    setStudentId(id);
                    console.log("🔹 Logged-in Student ID:", id);
                } else {
                    console.warn("⚠️ Student ID not found in token.");
                }
            } else {
                console.warn("⚠️ No auth token found.");
            }
        } catch (error) {
            console.error("❌ Error loading student ID:", error);
        }
    };

    const fetchProgramHistory = async (studentId) => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) return;

            const url = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/history?StudentId=${studentId}&Sort=joinedAtAsc&page=1&pageSize=10`;
            console.log("🔹 Fetching program history from:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) return;

            const data = await response.json();
            console.log("🔹 API Response:", JSON.stringify(data, null, 2));

            if (!Array.isArray(data.data)) return;

            setSignedUpPrograms(data.data);
        } catch (error) {
            console.error("❌ Error fetching program history:", error);
            setSignedUpPrograms([]);
        }
    };

    const handleCancel = async (programId) => {
        try {
            console.log("🚀 Cancelling program with ID:", programId);
            console.log("🚀 Cancelling program with studentID:", studentId);
            if (!studentId) return;

            const url = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/unregister`;
            console.log("🔹 API Request URL:", url);

            const token = await AsyncStorage.getItem("authToken");
            if (!token) return;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ studentId, supportingProgramId: programId }),
            });

            console.log("🔹 Response Status:", response.status);

            if (!response.ok) return;

            console.log("✅ Unregistration successful!");
            setSignedUpPrograms((prev) => prev.filter((p) => p.id !== programId));
        } catch (error) {
            console.error("❌ Error canceling program:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Failed to load programs. Please try again later.</Text>;
    }

    return (
        <FlatList
            data={programs}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.headerText}>Available Supporting Programs</Text>}
            renderItem={({ item }) => {
                const isSignedUp = signedUpPrograms.some((p) => p.id === item.id);

                return (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("SPDetailScreen", { programId: item.id })}
                        disabled={isSignedUp}
                    >
                        <Image
                            source={{ uri: item.cloudinaryImageUrl || "https://via.placeholder.com/80" }}
                            style={styles.thumbnail}
                        />
                        <View style={styles.cardContent}>
                            <Text style={styles.title}>{item.city}</Text>
                            <Text style={styles.address}>{item.street}</Text>
                            <Text style={styles.date}>Start Date: {new Date(item.startDateAt).toDateString()}</Text>
                        </View>
                        <Text style={styles.quantity}>{isSignedUp ? "Already Signed Up" : "Available"}</Text>
                    </TouchableOpacity>
                );
            }}
            ListFooterComponent={
                <View style={styles.container}>
                    <Text style={styles.headerText}>Your Signed-Up Programs</Text>
                    {signedUpPrograms.length > 0 ? (
                        signedUpPrograms.map((program) => (
                            <View key={program.id} style={styles.signedUpCard}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("SPDetailScreen", { programId: program.id })}
                                >
                                    <Image source={{ uri: program.cloudinaryImageUrl }} style={styles.thumbnail} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.title}>{program.city}</Text>
                                        <Text style={styles.address}>{program.street}</Text>
                                        <Text style={styles.date}>Start Date: {new Date(program.startDateAt).toDateString()}</Text>
                                    </View>
                                    <Text style={styles.quantity}>Signed Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => handleCancel(program.id)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noServicesText}>You have not signed up for any programs yet.</Text>
                    )}
                </View>
            }
        />
    );
};

export default ServiceScreen;

const styles = StyleSheet.create({
    container: { padding: 16 },
    headerText: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    card: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 10, padding: 10, marginVertical: 8, elevation: 3, alignItems: "center" },
    signedUpCard: { backgroundColor: "#F8F8F8", borderRadius: 10, padding: 10, marginVertical: 8, elevation: 3 },
    thumbnail: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
    cardContent: { flex: 1 },
    title: { fontSize: 16, fontWeight: "bold" },
    address: { fontSize: 14, color: "#666" },
    date: { fontSize: 12, color: "#888" },
    quantity: { fontSize: 14, fontWeight: "bold", color: "#007AFF" },
    cancelButton: { backgroundColor: "#FF3B30", padding: 8, borderRadius: 5, alignItems: "center", marginTop: 10 },
    cancelButtonText: { color: "#FFF", fontWeight: "bold" },
    noServicesText: { textAlign: "center", marginTop: 10, fontSize: 16, color: "#888" },
});
