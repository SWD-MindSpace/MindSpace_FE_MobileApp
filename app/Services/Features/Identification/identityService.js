import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // FIXED: Proper import at the top
import CONFIG from "@/app/Services/Configs/config";

const login = async (username, password) => {
    const apiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identities/login`;

    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email: username, password }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Login failed: ${response.status} - ${errorText}`);
        }

        return await response.json(); // FIXED: Directly returning JSON data
    } catch (error) {
        console.error("Login API Error:", error);
        throw new Error("An error occurred while logging in.");
    }
};

const saveAuthData = async (token) => {
    if (!token) {
        throw new Error("Token is missing");
    }

    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken); // Debugging the token structure

    const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const studentId = decodedToken.sub || decodedToken["http://schemas.example.com/studentId"];
    const parentId = decodedToken["parentId"] || null;

    if (!userRole) {
        throw new Error("Role not found in token. Decoded token: " + JSON.stringify(decodedToken));
    }

    // Saving the auth data to AsyncStorage
    await AsyncStorage.setItem("authToken", token);
    await AsyncStorage.setItem("userRole", userRole);

    if (studentId) {
        await AsyncStorage.setItem("studentId", studentId.toString());
    } else if (parentId) {
        await AsyncStorage.setItem("parentId", parentId.toString());
    }

    return { userRole, studentId, parentId };
};

export default { login, saveAuthData };
