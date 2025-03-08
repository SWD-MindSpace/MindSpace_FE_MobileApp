import AsyncStorage from '@react-native-async-storage/async-storage';

const TEST_HISTORY_KEY = (role) => `testHistory_${role}`;

/**
 * Save a test result to AsyncStorage based on user role
 */
export const saveTestResult = async (testId, testName, totalScore, result, timestamp) => {
    try {
        let userRole = await AsyncStorage.getItem('userRole');
        userRole = userRole ? userRole.replace(/^"|"$/g, '') : null;

        if (!userRole) {
            console.error("No userRole found! Test history will not be saved.");
            return;
        }

        const storageKey = TEST_HISTORY_KEY(userRole);
        const existingHistory = await AsyncStorage.getItem(storageKey);
        const history = existingHistory ? JSON.parse(existingHistory) : [];

        const newEntry = { testId, testName, totalScore, result, timestamp };
        history.push(newEntry);

        await AsyncStorage.setItem(storageKey, JSON.stringify(history));
        console.log("Test history saved:", newEntry);
    } catch (error) {
        console.error("Error saving test result:", error);
    }
};

/**
 * Get test history based on user role
 */
export const getTestHistory = async () => {
    try {
        let userRole = await AsyncStorage.getItem('userRole');
        userRole = userRole ? userRole.replace(/^"|"$/g, '') : null;

        if (!userRole) return [];

        const storageKey = TEST_HISTORY_KEY(userRole);
        const history = await AsyncStorage.getItem(storageKey);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error("Error loading test history:", error);
        return [];
    }
};

/**
 * Remove a specific test history item
 */
export const removeTestHistoryItem = async (index) => {
    try {
        let userRole = await AsyncStorage.getItem('userRole');
        userRole = userRole ? userRole.replace(/^"|"$/g, '') : null;

        if (!userRole) return;

        const storageKey = TEST_HISTORY_KEY(userRole);
        const history = await getTestHistory();

        if (index < 0 || index >= history.length) {
            console.error("Invalid index, cannot remove test history item.");
            return;
        }

        history.splice(index, 1);
        await AsyncStorage.setItem(storageKey, JSON.stringify(history));
        console.log("Test history item removed at index:", index);
    } catch (error) {
        console.error("Error removing test history item:", error);
    }
};

/**
 * Clear all test history for the current user role
 */
export const clearTestHistory = async () => {
    try {
        let userRole = await AsyncStorage.getItem('userRole');
        userRole = userRole ? userRole.replace(/^"|"$/g, '') : null;

        if (!userRole) return;

        const storageKey = TEST_HISTORY_KEY(userRole);
        await AsyncStorage.removeItem(storageKey);
        console.log("Test history cleared for user role:", userRole);
    } catch (error) {
        console.error("Error clearing test history:", error);
    }
};

/**
 * Export test history, filtering out invalid test results
 */
export const exportTestHistory = async () => {
    try {
        const history = await getTestHistory();
        return history.filter(item => item.result !== 'Undefined');
    } catch (error) {
        console.error("Error exporting test history:", error);
        return [];
    }
};
