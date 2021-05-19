import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';
import { useNavigation } from '@react-navigation/core';

interface ProjectItemProps {
    project: {
        id: string;
        title: string;
        createdAt: string;
    };
}

const ProjectItem = ({ project }: ProjectItemProps) => {
    const navigation = useNavigation();
    const onPress = () => {
        // console.warn(`open ${project.title}`);
        navigation.navigate('ToDoScreen', { id: project.id });
    };
    return (
        <Pressable onPress={onPress} style={styles.rootContainer}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name="file-outline"
                    size={24}
                    color="white"
                />
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text style={styles.title}>{project.title}</Text>
                <Text style={styles.time}>{project.createdAt}</Text>
            </View>
        </Pressable>
    );
};

export default ProjectItem;
