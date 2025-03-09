import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "@/app/Services/Configs/config";

const usePrograms = (programId = null) => {
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

                const fetchJSON = async (url) => {
                    const response = await fetch(url, { headers });
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    const text = await response.text();
                    return text ? JSON.parse(text) : null;
                };

                const requests = [];

                // Fetch all programs if no specific programId is provided
                if (!programId) {
                    requests.push(
                        fetchJSON(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs`)
                            .then((data) => setPrograms(data?.data || []))
                    );
                } else {
                    // Fetch a specific program
                    requests.push(
                        fetchJSON(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/supporting-programs/${programId}`)
                            .then((data) => setProgram(data || {}))
                    );
                }

                // Fetch user profile
                requests.push(
                    fetchJSON(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/profile`)
                        .then((data) => setProfile(data || {}))
                );

                await Promise.all(requests);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [programId]);

    return { programs, program, profile, loading, error };
};

export default usePrograms;
