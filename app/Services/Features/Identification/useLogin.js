import { useState } from "react";
import { Alert } from "react-native";
import identityService from "@/app/Services/Features/Identification/identityService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password, navigation) => {
        setLoading(true);
        setError(null);

        try {
            const data = await identityService.login(username, password);

            if (data.access_token) {
                // Save token and user role into AsyncStorage
                const { userRole } = await identityService.saveAuthData(data.access_token);
                await AsyncStorage.setItem("userRole", userRole); // Save userRole in AsyncStorage

                // After saving, navigate based on the role
                switch (userRole.toLowerCase()) {
                    case "student":
                    case "parent":
                    case "psychologist":
                        navigation.navigate("MainScreen", { userRole }); // Pass userRole as a prop to MainScreen
                        break;
                    default:
                        throw new Error("Unknown role received");
                }
            }
        } catch (error) {
            console.error("Login Error:", error.message);
            setError(error.message);
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

export default useLogin;
