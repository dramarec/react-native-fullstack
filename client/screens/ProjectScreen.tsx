import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ProjectItem from '../components/ProjectItem';

const initialState = [
    {
        id: '1',
        title: 'Project 1',
        createdAt: '2d',
    },
    {
        id: '2',
        title: 'Project 2',
        createdAt: '2d',
    },
    {
        id: '3',
        title: 'Project 3',
        createdAt: '2d',
    },
];

export default function ProjectScreen() {
    const [project, setProject] = useState(initialState);

    return (
        <View style={styles.container}>
            <FlatList
                data={project}
                style={{ width: '100%' }}
                renderItem={({ item }) => (
                    <ProjectItem project={item} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
