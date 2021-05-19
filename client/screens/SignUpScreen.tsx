import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const onSubmit = () => {
        console.warn('onSubmit');
    };
    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="name"
                value={name}
                onChangeText={setName}
                style={{
                    color: 'white',
                    fontSize: 18,
                    width: '100%',
                    marginVertical: 25,
                }}
            />

            <TextInput
                placeholder="vadim@notjust.dev"
                value={email}
                onChangeText={setEmail}
                style={{
                    color: 'white',
                    fontSize: 18,
                    width: '100%',
                    marginVertical: 25,
                }}
            />

            <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    color: 'white',
                    fontSize: 18,
                    width: '100%',
                    marginVertical: 25,
                }}
            />

            <Pressable
                onPress={onSubmit}
                style={{
                    backgroundColor: '#e33062',
                    height: 50,
                    borderRadius: 5,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 30,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                >
                    Sign up
                </Text>
            </Pressable>

            <Pressable
                onPress={() => {
                    console.warn('nbavigate SignInScreen');
                    navigation.navigate('SignInScreen');
                }}
                style={{
                    height: 50,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                }}
            >
                <Text
                    style={{
                        color: '#e33062',
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                >
                    Already Have an account? Sign in
                </Text>
            </Pressable>
        </View>
    );
};

export default SignUpScreen;
