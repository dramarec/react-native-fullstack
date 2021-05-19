import React, { useState } from 'react';
import {
    StyleSheet,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
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
let id = '04';
export default function ToDoScreen() {
    const [todos, setTodos] = useState(initialState);
    const [title, setTitle] = useState('');

    const createNewItem = (atIndex: number) => {
        const newTodos = [...todos];
        newTodos.splice(atIndex, 1, {
            id: id,
            content: '',
            isCompleted: false,
        });
        setTodos(newTodos);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 130 : 0}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder={'Title'}
                    style={styles.title}
                />
                <FlatList
                    data={todos}
                    renderItem={({ item, index }) => (
                        <ToDoItem
                            todo={item}
                            onSubmit={() => createNewItem(index + 1)}
                        />
                    )}
                    style={{ width: '100%' }}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
    },
    title: {
        width: '100%',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});
