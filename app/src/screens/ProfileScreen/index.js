import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuthToken } from '@/app/src/utils/storage'
import CONFIG from '@/app/src/config/config';

const ProfileScreen = () => {
    const profileApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identity/profile`
    const [profileData, setProfileData] = useState(null); 

    const getProfile = async () => {
        try {
            const accessToken = await getAuthToken();
            const response = await fetch(profileApiURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            const jsonData = await response.json();
            console.log("API Response:", jsonData);

            if (jsonData) {
                setProfileData(jsonData);
            } else {
                console.error("No data found in API response.");
            }
        } catch (error) {
            console.error("Error fetching profile data", error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (!profileData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.profileHeader}>Your Profile</Text>
            <View style={styles.profileCard}>
                <Text style={styles.profileText}>
                    <Text style={styles.label}>Full Name:</Text> {profileData.fullName}
                </Text>
                <Text style={styles.profileText}>
                    <Text style={styles.label}>Email:</Text> {profileData.email}
                </Text>
                <Text style={styles.profileText}>
                    <Text style={styles.label}>Username:</Text> {profileData.userName}
                </Text>
                <Text style={styles.profileText}>
                    <Text style={styles.label}>Date of Birth:</Text> {profileData.dateOfBirth}
                </Text>
                <Text style={styles.profileText}>
                    <Text style={styles.label}>Phone:</Text> {profileData.phoneNumber || "N/A"}
                </Text>
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 20,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    profileHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    profileCard: {
        backgroundColor: '#fff',
        width: '100%',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    profileText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        color: '#000',
    },
});
