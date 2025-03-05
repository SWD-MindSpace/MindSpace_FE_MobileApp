import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_HISTORY_KEY = 'test_history';

export const saveTestResult = async (testId, totalScore, result, timestamp) => {
    try {
        const existingHistory = await AsyncStorage.getItem(TEST_HISTORY_KEY);
        const history = existingHistory ? JSON.parse(existingHistory) : [];

        const newEntry = { testId, totalScore, result, timestamp };

        history.push(newEntry);

        await AsyncStorage.setItem(TEST_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Error saving test result:", error);
    }
};

export const getTestHistory = async () => {
    try {
        const history = await AsyncStorage.getItem(TEST_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error("Error loading test history:", error);
        return [];
    }
};

export const clearTestHistory = async () => {
    try {
        await AsyncStorage.removeItem(TEST_HISTORY_KEY);
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