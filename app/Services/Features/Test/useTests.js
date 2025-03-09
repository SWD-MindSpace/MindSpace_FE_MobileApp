import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTests } from '@/app/Services/Features/Test/testService';

const useTests = (pageIndex, pageSize, selectedCategory) => {
    const [tests, setTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const loadUserRole = async () => {
            const role = await AsyncStorage.getItem('userRole');
            if (role) {
                setUserRole(role);
            }
        };
        loadUserRole();
    }, []);

    useEffect(() => {
        if (!userRole) return;

        const getTests = async () => {
            setLoading(true);
            try {
                const { data, count } = await fetchTests(pageIndex, pageSize, userRole, selectedCategory);

                const uniqueCategories = [...new Set(data.map(test => test.testCategory.name))];
                setCategories(uniqueCategories);

                setTests(data);
                setTotalCount(count); 
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getTests();
    }, [userRole, pageIndex, pageSize, selectedCategory]); 

    return { tests, categories, loading, totalCount };
};

export default useTests;
