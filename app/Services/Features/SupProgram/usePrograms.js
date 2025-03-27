import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "@/app/Services/Configs/config";

const usePrograms = (programId, userRole) => {
    const [programs, setPrograms] = useState([]);
    const [program, setProgram] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const accessToken = await AsyncStorage.getItem("authToken");
                if (!accessToken) {
                    throw new Error("Authentication required. Please log in.");
                }

                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                };

                const fetchJSON = async (url, context) => {
                    console.log(`🔹 Fetching ${context}:`, url);
                    const response = await fetch(url, { headers });

                    if (!response.ok) {
                        throw new Error(`Error fetching ${context} (${response.status}): ${response.statusText}`);
                    }

                    try {
                        const text = await response.text();
                        return text ? JSON.parse(text) : null;
                    } catch (error) {
                        console.error("JSON Parsing Error for", context, ":", error);
                        throw new Error(`Failed to parse ${context} response.`);
                    }
                };

                // Fetch user profile
                const profilePromise = fetchJSON(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/identities/profile`, "profile");

                // Determine what to fetch based on programId
                let programPromise = null;
                let programsPromise = null;

                if (programId && !isNaN(programId) && programId > 0) {
                    console.log("✅ Valid programId detected:", programId);
                    programPromise = fetchJSON(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/${programId}`, "program details");
                } else {
                    console.log("⚠️ No valid programId. Fetching all programs.");
                    programsPromise = fetchJSON(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs`, "all programs");
                }

                // Fetch the updated maxQuantity from AsyncStorage
                const storedQuantities = await AsyncStorage.getItem("programQuantities");
                const quantities = storedQuantities ? JSON.parse(storedQuantities) : {};

                // Execute fetch calls
                const [profileData, programData, programsData] = await Promise.all([
                    profilePromise,
                    programPromise ? programPromise : Promise.resolve(null),
                    programsPromise ? programsPromise : Promise.resolve(null),
                ]);

                // Update maxQuantity for each program from AsyncStorage data
                if (programsData?.data) {
                    programsData.data.forEach(program => {
                        const storedQuantity = quantities[program.id];
                        program.maxQuantity = storedQuantity !== undefined ? storedQuantity : program.maxQuantity;
                    });
                }

                // Set state based on fetched data
                setProfile(profileData || {});
                setProgram(programData || null);
                setPrograms(programsData?.data || []);

            } catch (err) {
                console.error("❌ Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [programId, userRole]);

    return { programs, program, profile, loading, error };
};

export default usePrograms;
