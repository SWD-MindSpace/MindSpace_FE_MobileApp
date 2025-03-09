import CONFIG from '@/app/Services/Configs/config';

export const fetchTests = async (pageIndex, pageSize, userRole, selectedCategory) => {
    try {
        let resourceApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/tests?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        
        const response = await fetch(resourceApiURL);
        const jsonData = await response.json();

        if (jsonData?.data) {
            let filteredTests = jsonData.data.filter(test => test.targetUser === userRole && test.testCategory.name !== "Parenting");

            if (selectedCategory) {
                filteredTests = filteredTests.filter(test => test.testCategory.name === selectedCategory);
            }

            return { data: filteredTests, count: jsonData.count }; // Ensure count remains unchanged
        }
        return { data: [], count: 0 };
    } catch (error) {
        console.error("Error fetching tests:", error);
        throw error;
    }
};



export const fetchTestResponses = async (testId) => {
    try {
        const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/test-responses/${testId}`);
        if (!response.ok) {
            throw new Error('Failed to load test responses');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching test responses:', error);
        throw error;
    }
};

export const fetchTestDetails = async (testId) => {
    try {
        const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/tests/${testId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch test details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching test details:', error);
        throw error;
    }
};
