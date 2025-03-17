import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CONFIG from "@/app/Services/Configs/config";

const useProgramDetail = (programId) => {
    const [program, setProgram] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("authToken");
                if (!accessToken) {
                    throw new Error("Authentication required. Please log in.");
                }

                const [programRes, profileRes] = await Promise.all([
                    fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/${programId}`),
                    fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/identities/profile`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`,
                        },
                    })
                ]);

                if (!programRes.ok) throw new Error("Failed to fetch program details");
                if (profileRes.status === 401) throw new Error("Session Expired. Please log in again.");
                if (!profileRes.ok) throw new Error("Failed to fetch profile data");

                const [programData, profileData] = await Promise.all([
                    programRes.json(),
                    profileRes.json(),
                ]);

                // Retrieve stored Cloudinary images from AsyncStorage
                const spImageUrls = await AsyncStorage.getItem("supportingProgramImages");
                const jsonParseSPImageUrls = JSON.parse(spImageUrls) || {};

                if (programData.id && jsonParseSPImageUrls[programData.id]) {
                    programData.imageUrl = jsonParseSPImageUrls[programData.id];
                }

                setProgram(programData);
                setProfileData(profileData);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [programId]);

    return { program, profileData, loading, error };
};

export default useProgramDetail;
