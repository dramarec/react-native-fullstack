import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput } from 'react-native';
import { useMutation, gql } from '@apollo/client';

import Checkbox from '../Checkbox';

const UPDATE_TODO = gql`
    mutation updateToDo(
        $id: ID!
        $content: String
        $isCompleted: Boolean
    ) {
        updateToDo(
            id: $id
            content: $content
            isCompleted: $isCompleted
        ) {
            id
            content
            isCompleted

            taskList {
                title
                progress
                todos {
                    id
                    content
                    isCompleted
                }
            }
        }
    }
`;

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

    const [updateItem] = useMutation(UPDATE_TODO);

    const callUpdateItem = () => {
        updateItem({
            variables: {
                id: todo.id,
                content,
                isCompleted: isChecked,
            },
        });
    };

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
                onPress={() => {
                    setIsChecked(!isChecked);
                    callUpdateItem();
                }}
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
                onEndEditing={callUpdateItem}
                onSubmitEditing={onSubmit}
                blurOnSubmit
                onKeyPress={onKeyPress}
            />
        </View>
    );
};

export default ToDoItem;
