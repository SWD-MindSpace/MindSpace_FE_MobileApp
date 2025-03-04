import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Save test results
export const saveTestResult = async (testId, score, result) => {
    try {
        const existingResults = await AsyncStorage.getItem('testResults');
        const parsedResults = existingResults ? JSON.parse(existingResults) : [];

        const newResult = { testId, score, result }; // ✅ Ensure score is included
        parsedResults.push(newResult);

        await AsyncStorage.setItem('testResults', JSON.stringify(parsedResults));
    } catch (error) {
        console.error("Error saving test result:", error);
    }
};


// ✅ Get all test results

export const getTestHistory = async () => {
    try {
        const storedHistory = await AsyncStorage.getItem('testResults');
        return storedHistory ? JSON.parse(storedHistory) : []; // ✅ Return an array, not null
    } catch (error) {
        console.error("Error retrieving test history:", error);
        return [];
    }
};


// ✅ Clear test history
export const clearTestHistory = async () => {
    try {
        await AsyncStorage.removeItem('testResults');
    } catch (error) {
        console.error("Error clearing test history:", error);
    }
};


const StorageHelper = {
    getItem: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting item ${key}:`, error);
            return null;
        }
    },

    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key}:`, error);
        }
    },

    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item ${key}:`, error);
        }
    }
};

export default StorageHelper;