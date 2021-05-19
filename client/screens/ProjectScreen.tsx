import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ProjectItem from '../components/ProjectItem';
import { useQuery, gql } from '@apollo/client';

const MY_PROJECTS = gql`
    query myTaskLists {
        myTaskLists {
            id
            title
            createdAt
        }
    }
`;

export default function ProjectScreen() {
    const [project, setProject] = useState([]);

    const { data, error, loading } = useQuery(MY_PROJECTS);

    useEffect(() => {
        if (error) {
            Alert.alert('Error fetching projects', error.message);
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            setProject(data.myTaskLists);
        }
    }, [data]);

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
