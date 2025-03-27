import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { LogBox } from 'react-native';

import useBlogs from '@/app/Services/Features/Blog/useBlogsDetail';

const { width } = Dimensions.get('window');

const BlogDetail = ({ route }) => {
    const { blogId } = route.params;
    const { blog, loading } = useBlogs(blogId);
    
    const memoizedHtmlSource = useMemo(() => ({
        html: blog?.description || "<p>No description available</p>"
    }), [blog?.description]);
    
    if (loading) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    if (!blog) {
        return <Text style={styles.errorText}>Blog not found</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Blog Thumbnail */}
            <Image source={{ uri: blog.cloudinaryImageUrl }} style={styles.thumbnail} />

            {/* Title */}
            <Text style={styles.title}>{blog.title}</Text>

            {/* Stand-out Attributes */}
            <View style={styles.infoContainer}>
                <Text style={styles.specialization}>
                    <Text style={styles.boldText}>Specialization: </Text>
                    {blog.specializationName}
                </Text>
                <Text style={styles.manager}>
                    <Text style={styles.boldText}>Managed by: </Text>
                    {blog.schoolManagerName}
                </Text>
            </View>

            {/* Introduction */}
            <Text style={styles.introduction}>{blog.introduction}</Text>

            {/* Bordered Sections */}
            {blog.sections.map((section, index) => (
                <View key={index} style={styles.sectionContainer}>
                    <Text style={styles.sectionHeading}>{section.heading}</Text>
                    <RenderHtml contentWidth={width} source={{ html: section.htmlContent }} />
                </View>
            ))}
        </ScrollView>
    );
};

LogBox.ignoreLogs([
    'Warning: TNodeChildrenRenderer: Support for defaultProps will be removed',
]);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    thumbnail: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },
    specialization: {
        fontSize: 16,
        color: '#0277BD',
        marginBottom: 5,
    },
    manager: {
        fontSize: 16,
        color: '#0277BD',
    },
    boldText: {
        fontWeight: 'bold',
    },
    introduction: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 15,
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
    },
});

export default BlogDetail;