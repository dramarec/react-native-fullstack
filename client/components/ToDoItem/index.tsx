import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import Checkbox from '../Checkbox';

interface TodoItemProps {
    todo: {
        id: String;
        content: String;
        isCompleted: boolean;
    };
}

const ToDoItem = (props: TodoItemProps) => {
    const { todo } = props;
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
        if (!todo) {
            return;
        }
        setIsChecked(todo.isCompleted);
    }, [todo]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
            {/* Checbox */}
            <Checkbox isChecked={isChecked} onPress={() => setIsChecked(!isChecked)} />

            {/* Text Input */}
            <TextInput
                style={{ flex: 1, fontSize: 18, color: 'white', marginLeft: 12 }}
                multiline
            />
        </View>
    );
};

export default ToDoItem;
