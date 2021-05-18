import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';
import Checkbox from '../Checkbox';

interface TodoItemProps {
    todo: {
        id: string;
        content: string;
        isCompleted: boolean;
    };
    onSubmit: () => void;
}

const ToDoItem = (props: TodoItemProps) => {
    const { todo, onSubmit } = props;

    const [isChecked, setIsChecked] = useState(false);
    const [content, setContent] = useState('');

    const input = useRef(null);

    useEffect(() => {
        if (!todo) {
            return;
        }
        setIsChecked(todo.isCompleted);
        setContent(todo.content);
    }, [todo]);

    useEffect(() => {
        if (input.current) {
            input?.current?.focus();
        }
    }, [input]);

    const onKeyPress = ({ nativeEvent }) => {
        console.log(nativeEvent);
        if (nativeEvent.key === 'Backspace' && content === '') {
            // delete item
            console.warn('Delete item');
        }
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 3,
            }}
        >
            {/* Checbox */}
            <Checkbox
                isChecked={isChecked}
                onPress={() => setIsChecked(!isChecked)}
            />

            {/* Text Input */}
            <TextInput
                ref={input}
                value={content}
                onChangeText={setContent}
                style={{
                    flex: 1,
                    fontSize: 18,
                    color: 'white',
                    marginLeft: 12,
                }}
                multiline
                onSubmitEditing={onSubmit}
                blurOnSubmit
                onKeyPress={onKeyPress}
            />
        </View>
    );
};

export default ToDoItem;
