import { Image, FlatList, StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Button } from "react-native";
import React from "react";
import useBlogs from "@/app/Services/Features/Blog/useBlogs";
import useArticles from "@/app/Services/Features/Article/useArticles";
import { useRef } from "react";
const { width } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";

const MainScreen = ({ navigation, route }) => {
    const { userRole } = route.params || {};
    const { blogs, activeIndex, setActiveIndex, flatListRef } = useBlogs();
    const { articles } = useArticles();
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0 && viewableItems[0]?.index !== undefined) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;


    const clearAllData = async () => {
        try {
            await AsyncStorage.clear();
            console.log("✅ AsyncStorage has been cleared!");
        } catch (error) {
            console.error("❌ Error clearing AsyncStorage:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Swipeable Header Blog Section */}
            <FlatList
                ref={flatListRef}
                data={blogs}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate="fast"
                contentContainerStyle={{ alignItems: "center" }}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                initialNumToRender={6}
                maxToRenderPerBatch={10}
                renderItem={({ item }) => (
                    <View style={styles.mainBlogContainer}>
                        <Image source={{ uri: item.cloudinaryImageUrl }} style={styles.mainImage} />
                        <Text style={styles.mainText}>{item.title}</Text>
                        <TouchableOpacity
                            style={styles.readMoreButton}
                            onPress={() => navigation.navigate("BlogDetail", { blogId: item.id })}
                        >
                            <Text style={styles.readMoreText}>Read More</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Indicator Dots */}
            <View style={styles.indicatorContainer}>
                {blogs.map((_, index) => (
                    <View key={index} style={[styles.indicator, activeIndex === index && styles.activeIndicator]} />
                ))}
            </View>

            {/* Latest Blogs Section */}
            <View style={styles.blogContainer}>
                <Text style={styles.sectionHeader}>Latest Blogs</Text>
                {blogs.length > 0 ? (
                    <FlatList
                        data={blogs}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.blogItem}>
                                    <TouchableOpacity onPress={() => navigation.navigate("BlogDetail", { blogId: item.id })}>
                                        {item.cloudinaryImageUrl ? (
                                            <Image source={{ uri: item.cloudinaryImageUrl }} style={styles.blogImage} />
                                        ) : (
                                            <Text>No Image</Text>
                                        )}
                                        <View style={styles.textWrapper}>
                                            <Text style={styles.blogText}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>No Blogs Available</Text>
                )}

            </View>

            {/* Latest Articles Section */}
            <View style={styles.blogContainer}>
                <Text style={styles.sectionHeader}>Latest Articles</Text>
                <FlatList
                    data={articles}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.articleItem}
                            onPress={() => navigation.navigate("ArticleDetail", { articleId: item.id })}
                        >
                            <Image source={{ uri: item.cloudinaryImageUrl }} style={styles.articleImage} />
                            <View style={styles.articleTextContainer}>
                                <Text style={styles.articleText}>{item.title}</Text>
                                <Text style={styles.articleTime}>{item.publishedAt}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

        </ScrollView>
    );
};

export default MainScreen;


const styles = StyleSheet.create({
    container: { flex: 1 },
    mainBlogContainer: { width: width, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, top: -100, marginBottom: -200 },
    mainImage: { width: '90%', height: 220, borderRadius: 10 },
    mainText: { fontWeight: 'bold', fontSize: 18, marginTop: 10, textAlign: 'center', paddingHorizontal: 10 },
    readMoreButton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#007BFF', borderRadius: 5 },
    readMoreText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D3D3D3', marginHorizontal: 5 },
    activeIndicator: { backgroundColor: '#007BFF', width: 10, height: 10 },
    blogContainer: { flex: 1, padding: 10 },
    blogItem: { 
        width: '48%', 
        margin: '1%', 
        padding: 10, 
        borderRadius: 8, 
        alignItems: 'center', 
        backgroundColor: 'lightblue', 
        marginBottom: 300,
        justifyContent: 'center' // Ensures content is centered
    },
    blogImage: { 
        width: 130, 
        height: 130, 
        borderRadius: 8, 
        resizeMode: "cover", 
        backgroundColor: "gray",
        alignSelf: 'center' // Ensures image is centered inside the container
    },
    textWrapper: { borderTopWidth: 1, borderTopColor: '#E0E0E0', marginTop: 5, paddingTop: 5 },
    blogText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 5, color: '#333', paddingHorizontal: 5 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: '#E0E0E0', letterSpacing: 1 },
    articleItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, marginVertical: 8, overflow: 'hidden' },
    articleImage: { width: '50%', height: 100, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
    articleTextContainer: { width: '50%', padding: 10, justifyContent: 'center' },
    articleText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    articleTime: { fontSize: 14, color: '#777', marginTop: 4 },
});

