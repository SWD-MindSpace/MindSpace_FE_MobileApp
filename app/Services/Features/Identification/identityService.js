import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "@/app/Services/Configs/config";

const login = async (username, password) => {
    const apiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/login`;

    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: username, password }),
    });

    const text = await response.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch (error) {
        throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status} - ${data.message || "Invalid request"}`);
    }

    return data;
};

const saveAuthData = async (token) => {
    const { jwtDecode } = await import("jwt-decode");
    const decodedToken = jwtDecode(token);

    const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const studentId = decodedToken.sub || decodedToken["http://schemas.example.com/studentId"];
    const parentId = decodedToken["parentId"] || null;

    if (!userRole) throw new Error("Role not found in token");

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
