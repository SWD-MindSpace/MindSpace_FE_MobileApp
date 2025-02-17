import { Animated, Easing, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'

const AppWelcomeLogo = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                delay: 1000,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
        ]).start(() => {
            navigation.replace('HomeScreen'); 
        });
    }, [fadeAnim, navigation]);

    return (
        <View style={styles.container}>
            <Animated.Image 
                source={require('@/assets/images/AppLogoImage.png')} 
                style={[styles.logo, { opacity: fadeAnim }]} 
            />
        </View>
    );
};

export default AppWelcomeLogo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', 
    },
    logo: {
        width: 400,
        height: 400,
        resizeMode: 'contain',
    },
});
