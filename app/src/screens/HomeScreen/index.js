import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthContext } from '@/app/src/context/AuthContext';

const HomeScreen = ({ navigation }) => {
    const { signIn } = useContext(AuthContext);
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        try {
            await signIn(username, password);
            navigation.navigate('MainScreen');
        } catch (error) {
            Alert.alert('Login Failed', error.message || 'Invalid username or password.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.welcomebackTitle}>
                <Text style={styles.textTitle}>Welcome back,</Text>
                <Text style={styles.textTitle}>Please sign in to continue</Text>
            </View>
            <View style={styles.formInput}>
                <TextInput
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <View style={styles.rememberForgotContainer}>
                    <Pressable style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
                        <View style={[styles.checkbox, rememberMe && styles.checkedBox]} />
                        <Text style={styles.rememberMeText}>Remember Me</Text>
                    </Pressable>

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomebackTitle: {
        marginLeft: 40,
        marginBottom: 20,
        width: '100%',
    },
    textTitle: {
        fontSize: 28,
        fontWeight: '600',
    },
    formInput: {
        gap: 45,
        padding: 20,
        width: '100%',
    },
    input: {
        backgroundColor: '#e0d6d5',
        borderWidth: 1,
        borderColor: '#a8a2a2',
        fontSize: 15,
        padding: 20,
        borderRadius: 8,
    },
    rememberForgotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: -10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#007BFF',
        marginRight: 6,
    },
    checkedBox: {
        backgroundColor: '#007BFF',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#333',
    },
    forgotPassword: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    loginButton: {
        width: '60%',
        height: 55,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});