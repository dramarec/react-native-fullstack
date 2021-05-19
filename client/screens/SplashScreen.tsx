import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkedUser = async () => {
            if (await isAuthenticated()) {
                navigation.navigate('Home');
            } else {
                navigation.navigate('SignInScreen');
            }
        };
        checkedUser();
    }, []);

    const isAuthenticated = async () => {
        // await AsyncStorage.removeItem('token');
        const token = await AsyncStorage.getItem('token');
        return !!token;
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator />
        </View>
    );
};

export default SplashScreen;
