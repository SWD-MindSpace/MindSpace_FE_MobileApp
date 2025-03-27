import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supProgramService from "@/app/Services/Features/SupProgram/supProgramService";

const useFetchPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setLoading(true);
                const data = await supProgramService.fetchPrograms();
                const storedQuantities = await AsyncStorage.getItem("programQuantities");
                const quantityData = storedQuantities ? JSON.parse(storedQuantities) : {};

                const updatedPrograms = data.map(program => ({
                    ...program,
                    maxQuantity: quantityData[program.id] ?? program.maxQuantity
                }));

                setPrograms(updatedPrograms);

                // Only update AsyncStorage if data has changed
                const newQuantityData = updatedPrograms.reduce((acc, program) => {
                    acc[program.id] = program.maxQuantity;
                    return acc;
                }, {});

                if (JSON.stringify(quantityData) !== JSON.stringify(newQuantityData)) {
                    await AsyncStorage.setItem("programQuantities", JSON.stringify(newQuantityData));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    // Handle automatic scrolling separately
    useEffect(() => {
        if (programs.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % programs.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [programs]);

    // Scroll when activeIndex updates
    useEffect(() => {
        if (programs.length > 0) {
            try {
                flatListRef.current?.scrollToIndex({ index: activeIndex, animated: true });
            } catch (error) {
                console.warn("Scroll error:", error);
            }
        }
    }, [activeIndex, programs]);

    return { programs, setPrograms, activeIndex, setActiveIndex, flatListRef, loading, error };
};

export default useFetchPrograms;
