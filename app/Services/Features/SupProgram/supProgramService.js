import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "@/app/Services/Configs/config";

const API_BASE_URL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}`;

const getAuthToken = async () => {
    return await AsyncStorage.getItem("authToken");
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
};

const supProgramService = {
    async fetchPrograms() {
        try {
            const accessToken = await getAuthToken();
            if (!accessToken) {
                throw new Error("Authentication required. Please log in.");
            }

            const response = await fetch(`${API_BASE_URL}/supporting-programs`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            const jsonData = await handleResponse(response);

            const spImageUrls = await AsyncStorage.getItem("supportingProgramImages");
            const jsonParseSPImageUrls = JSON.parse(spImageUrls) || {};

            return jsonData?.data.map((item) => ({
                ...item,
                cloudinaryImageUrl: jsonParseSPImageUrls[item.id] || null,
            })) || [];
        } catch (error) {
            console.error("Error fetching programs:", error);
            throw error;
        }
    },

    async fetchProgramDetails(programId) {
        try {
            const response = await fetch(`${API_BASE_URL}/supporting-programs/${programId}`);
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching program details:", error);
            throw error;
        }
    },

    async fetchUserProfile() {
        try {
            const token = await getAuthToken();
            if (!token) throw new Error("No authentication token found. Please log in again.");

            const response = await fetch(`${API_BASE_URL}/identities/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    async signUpForProgram(programId) {
        try {
            const token = await getAuthToken();
            if (!token) throw new Error("No authentication token found. Please log in again.");

            const response = await fetch(`${API_BASE_URL}/supporting-programs/${programId}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error signing up for program:", error);
            throw error;
        }
    },
};

export default supProgramService;
