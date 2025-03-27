import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTests, fetchTestDetails } from '@/app/Services/Features/Test/testService';

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
                setUserRole(role.trim().toLowerCase());
                console.log("Loaded User Role:", role.trim().toLowerCase());
            }
        };
        loadUserRole();
    }, []);

    // Fetch tests based on userRole and category
    useEffect(() => {
        if (!userRole) return;

        const getTests = async () => {
            setLoading(true);
            try {
                console.log("Fetching tests for role:", userRole);
                const { data, count } = await fetchTests(pageIndex, pageSize, userRole, selectedCategory);
                console.log("Fetched Tests:", data);

                // Extract unique categories
                setCategories([...new Set(data.map(test => test.testCategory.name))]);

                // If the selected category is "Parenting", fetch full details
                if (selectedCategory === "Parenting") {
                    const parentingTest = data.find(test => test.testCategory.name === "Parenting");
                    if (parentingTest) {
                        console.log("Fetching additional details for Parenting test...");
                        const detailedTest = await fetchTestDetails(parentingTest.id);
                        setTests([detailedTest]); // Replace with detailed test
                        setTotalCount(1);
                        setLoading(false);
                        return;
                    }
                }

                setTests(data);
                setTotalCount(count);
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
