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
                await AsyncStorage.setItem("authToken", data.access_token);

                const { userRole } = await identityService.saveAuthData(data.access_token);

                switch (userRole.toLowerCase()) {
                    case "student":
                    case "parent":
                    case "psychologist":
                        navigation.navigate("MainScreen", { userRole });
                        break;
                    default:
                        throw new Error("Unknown role received");
                }
            } else {
                throw new Error("No access token received from API.");
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
