import { View, Text } from 'react-native';
import React from 'react';

const BlogDetail = ({ route }) => {
    const { blogId } = route.params;
    
    return (
        <View>
            <Text>Blog Detail for Blog ID: {blogId}</Text>
        </View>
    );
};

export default BlogDetail;
