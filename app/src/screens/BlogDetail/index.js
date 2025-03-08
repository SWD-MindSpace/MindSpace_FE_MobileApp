import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import CONFIG from '@/app/src/config/config'
const { width } = Dimensions.get('window');
import { LogBox } from 'react-native';


const BlogDetail = ({ route }) => {
    const { blogId } = route.params;
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const blogApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/blogs/${blogId}`;

    useEffect(() => {
        const getBlogDetail = async () => {
            try {
                const response = await fetch(blogApiURL);
                const jsonData = await response.json();
                if (jsonData) {
                    setBlog(jsonData);
                }
            } catch (error) {
                console.error("Error fetching blog detail:", error);
            } finally {
                setLoading(false);
            }
        };

        getBlogDetail();
    }, [blogId]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!blog) {
        return <Text>Blog not found</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: blog.thumbnailUrl }} style={styles.thumbnail} />
            <Text style={styles.title}>{blog.title}</Text>
            <Text style={styles.introduction}>{blog.introduction}</Text>
            <Text style={styles.specialization}>Specialization: {blog.specializationName}</Text>
            <Text style={styles.manager}>Managed by: {blog.schoolManagerName}</Text>

            {blog.sections.map((section, index) => (
                <View key={index} style={styles.sectionContainer}>
                    <Text style={styles.sectionHeading}>{section.heading}</Text>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: section.htmlContent }}
                    />
                </View>
            ))}
        </ScrollView>
    );
};


LogBox.ignoreLogs([
    'Warning: TNodeChildrenRenderer: Support for defaultProps will be removed',
]);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    thumbnail: { width: '100%', height: 200, borderRadius: 10 },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    introduction: { fontSize: 16, color: '#555' },
    specialization: { fontSize: 14, fontStyle: 'italic', marginVertical: 10 },
    manager: { fontSize: 14, marginBottom: 20 },
    sectionContainer: { marginBottom: 20 },
    sectionHeading: { fontSize: 18, fontWeight: 'bold' },
});

export default BlogDetail;
