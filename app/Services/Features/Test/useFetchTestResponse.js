import { useState, useEffect } from 'react';
import { fetchTestResponses } from '@/app/Services/Features/Test/testService';

const useFetchTestResponse = (testId) => {
    const [testResponses, setTestResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTestResponses(testId);
                console.log('Fetched test responses:', response); // Debugging
                setTestResponses(response || []); // Ensure it's an array

            } catch (err) {
                console.error('Error fetching test responses:', err);
                setError('Failed to load test responses');
            } finally {
                setLoading(false);
            }
        };

        if (testId) {
            fetchData();
            console.log('Fetching test responses for:', testId);

        }
        console.log('Received test responses:', testResponses);
    }, [testId]);


    return { testResponses, loading, error };
};

export default useFetchTestResponse;
