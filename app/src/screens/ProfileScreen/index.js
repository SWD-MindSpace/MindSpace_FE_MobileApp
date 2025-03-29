import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '@/app/Services/Configs/config';
import { Avatar } from 'react-native-paper';

const ProfileScreen = () => {
    const profileApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/identities/profile`;
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('authToken');
            if (!accessToken) {
                throw new Error("No auth token found");
            }
            
            const response = await fetch(profileApiURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json();
            setProfileData(jsonData);
        } catch (error) {
            console.error("Error fetching profile data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Loading Profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Avatar.Image 
                size={100} 
                source={{ uri: 'https://via.placeholder.com/100' }} 
                style={styles.avatar}
            />
            <Text style={styles.profileHeader}>{profileData.fullName}</Text>
            <Text style={styles.profileSubtext}>{profileData.email}</Text>

            <View style={styles.profileCard}>
                <ProfileDetail label="Username" value={profileData.userName} />
                <ProfileDetail label="Date of Birth" value={profileData.dateOfBirth} />
                <ProfileDetail label="Phone" value={profileData.phoneNumber || "N/A"} />
            </View>
        </ScrollView>
    );
};

const ProfileDetail = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F0F5FF',
        padding: 20,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
    },
    avatar: {
        marginBottom: 15,
    },
    profileHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
        textAlign: 'center',
    },
    profileSubtext: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
        textAlign: 'center',
    },
    profileCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
    value: {
        fontSize: 16,
        color: '#007BFF',
    },
});
