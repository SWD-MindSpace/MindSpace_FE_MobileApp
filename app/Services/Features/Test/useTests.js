import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTests } from '@/app/Services/Features/Test/testService';

const useTests = (pageIndex, pageSize, selectedCategory) => {
    const [tests, setTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Load user role from AsyncStorage
    useEffect(() => {
        const loadUserRole = async () => {
            const role = await AsyncStorage.getItem('userRole');
            if (role) {
                const formattedRole = role.trim().toLowerCase(); // Ensure consistent formatting
                setUserRole(formattedRole);
                console.log("Loaded User Role:", formattedRole); // Debugging
            }
        };
        loadUserRole();
    }, []);

    // Fetch tests based on userRole
    useEffect(() => {
        if (!userRole) return; // Ensure userRole is available before fetching

        const getTests = async () => {
            setLoading(true);
            try {
                console.log("Fetching tests for role:", userRole); // Debugging

                const { data, count } = await fetchTests(pageIndex, pageSize, userRole, selectedCategory);
                console.log("Fetched Tests:", data); // Debugging

                setTests(data);
                setTotalCount(count);

                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(test => test.testCategory.name))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error loading tests:", error);
            } finally {
                setLoading(false);
            }
        };

        getTests();
    }, [userRole, pageIndex, pageSize, selectedCategory]);

    return { tests, categories, loading, totalCount };
};

export default useTests;
