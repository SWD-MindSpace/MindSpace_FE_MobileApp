import { Image, FlatList, StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {

    const blogData = [
        {
            title: "Latest blogs",
            data: [
                {
                    id: 6,
                    name: "How to Harness the Power of Positivity for Better Mental Health",
                    imageLink: require("@/assets/images/blog1.png"),

                },
                {
                    id: 7,
                    name: "Dealing with the Death of Your Child",
                    imageLink: require("@/assets/images/blog2.png"),

                },
                {
                    id: 8,
                    name: "Why Talking About Your Mental Health Matters",
                    imageLink: require("@/assets/images/blog3.png"),

                },
                {
                    id: 9,
                    name: "How to Cope with PTSD",
                    imageLink: require("@/assets/images/blog4.png"),

                },
            ],
        },
    ];
    const headerBlogData = [
        {
            id: 1,
            name: "How to Maintain Intimacy in Your Relationship",
            imageLink: require("@/assets/images/mainblog1.png"),
        },
        {
            id: 2,
            name: "10 Ways to Strengthen Your Mental Health",
            imageLink: require("@/assets/images/mainblog2.png"),
        },
        {
            id: 3,
            name: "The Impact of Stress on Your Body",
            imageLink: require("@/assets/images/mainblog3.png"),
        },
        {
            id: 4,
            name: "Understanding Anxiety Disorders",
            imageLink: require("@/assets/images/blog4.png"),
        },
        {
            id: 5,
            name: "How to Help Someone with Depression",
            imageLink: require("@/assets/images/mainblog5.png"),
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % headerBlogData.length;
            setActiveIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 5000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    return (
        <ScrollView style={styles.container}>
            {/* Swipeable Blog Header */}
            <FlatList
                ref={flatListRef}
                data={headerBlogData}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate="fast"
                contentContainerStyle={{ alignItems: 'center' }}
                onViewableItemsChanged={({ viewableItems }) => {
                    if (viewableItems.length > 0) {
                        setActiveIndex(viewableItems[0].index);
                    }
                }}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                renderItem={({ item }) => (
                    <View style={styles.mainBlogContainer}>
                        <Image source={item.imageLink} style={styles.mainImage} />
                        <Text style={styles.mainText}>{item.name}</Text>
                        <TouchableOpacity
                            style={styles.readMoreButton}
                            onPress={() => navigation.navigate('BlogDetail', { blogId: item.id })}
                        >
                            <Text style={styles.readMoreText}>Read More</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Indicator Dots */}
            <View style={styles.indicatorContainer}>
                {headerBlogData.map((_, index) => (
                    <View key={index} style={[styles.indicator, activeIndex === index && styles.activeIndicator]} />
                ))}
            </View>

            <View style={styles.blogContainer}>
                {blogData.map((section, index) => (
                    <View key={index}>
                        <Text style={styles.sectionHeader}>{section.title}</Text>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={section.data}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={2}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <View style={styles.blogItem}>
                                        <TouchableOpacity onPress={() => navigation.navigate('BlogDetail', { blogId: item.id })}>
                                            <View>
                                                <Image source={item.imageLink} style={styles.blogImage} />
                                            </View>
                                            <View style={styles.textWrapper}>
                                                <Text style={styles.blogText}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView >
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainBlogContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    mainImage: {
        width: '90%',
        height: 220,
        borderRadius: 10,
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    readMoreButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    readMoreText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D3D3D3',
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#007BFF',
        width: 10,
        height: 10,
    },
    blogContainer: {
        flex: 1,
        padding: 10,
    },
    blogItem: {
        width: '48%',
        margin: '1%',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'lightblue',
    },
    blogImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },
    textWrapper: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        marginTop: 5,
        paddingTop: 5,
    },
    blogText: {
        fontSize: 14,
        textAlign: 'center',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
        letterSpacing: 1,
    },
});





