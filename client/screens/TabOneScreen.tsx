import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '../components/Themed';
import ToDoItem from '../components/ToDoItem';

const initialState = [
    {
        id: '1',
        content: 'Drink Coffee',
        isCompleted: true,
    },
    {
        id: '2',
        content: 'Learn JS',
        isCompleted: true,
    },
    {
        id: '3',
        content: 'Learn TS',
        isCompleted: true,
    },
];

export default function TabOneScreen() {
    const [todos, setTodos] = useState(initialState);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab One</Text>
            <FlatList
                data={todos}
                renderItem={({ item }) => <ToDoItem todo={item} />}
                style={{ width: '100%' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
