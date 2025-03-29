import { Image, FlatList, StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React, { useRef } from "react";
import useBlogs from "@/app/Services/Features/Blog/useBlogs";
import useArticles from "@/app/Services/Features/Article/useArticles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

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

    return (
        <ScrollView style={styles.container}>
            {/* Featured Blog Section (Swipeable) */}
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
                contentContainerStyle={styles.blogSlider}
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
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Latest Blogs</Text>
                {blogs.length > 0 ? (
                    <FlatList
                        data={blogs}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: "space-between" }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.blogItem}
                                onPress={() => navigation.navigate("BlogDetail", { blogId: item.id })}
                            >
                                <Image source={{ uri: item.cloudinaryImageUrl }} style={styles.blogImage} />
                                <Text style={styles.blogText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text style={styles.noContentText}>No Blogs Available</Text>
                )}
            </View>

            {/* Latest Articles Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>Latest Articles</Text>
                {articles.length > 0 ? (
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
                ) : (
                    <Text style={styles.noContentText}>No Articles Available</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default MainScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9F9F9" },
    
    // Featured Blog Section
    blogSlider: { alignItems: "center", paddingVertical: 20 },
    mainBlogContainer: { width, alignItems: "center", paddingVertical: 20 },
    mainImage: { width: "90%", height: 220, borderRadius: 10 },
    mainText: { fontWeight: "bold", fontSize: 18, marginTop: 10, textAlign: "center", paddingHorizontal: 10 },
    readMoreButton: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#007BFF", borderRadius: 5 },
    readMoreText: { color: "white", fontSize: 16, fontWeight: "bold" },

    // Indicator Dots
    indicatorContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
    indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D3D3D3", marginHorizontal: 5 },
    activeIndicator: { backgroundColor: "#007BFF", width: 10, height: 10 },

    // Section Layout
    sectionContainer: { paddingHorizontal: 10, paddingBottom: 20 },
    sectionHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 10, borderBottomWidth: 2, borderBottomColor: "#E0E0E0", paddingBottom: 5 },

    // Blog Items
    blogItem: { width: "48%", padding: 10, borderRadius: 8, alignItems: "center", backgroundColor: "white", marginBottom: 20, elevation: 2 },
    blogImage: { width: "100%", height: 120, borderRadius: 8, resizeMode: "cover", backgroundColor: "gray" },
    blogText: { fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 5, color: "#333", paddingHorizontal: 5 },

    // Articles Section
    articleItem: { flexDirection: "row", backgroundColor: "white", borderRadius: 10, marginVertical: 8, overflow: "hidden", elevation: 2 },
    articleImage: { width: 100, height: 100, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
    articleTextContainer: { flex: 1, padding: 10, justifyContent: "center" },
    articleText: { fontSize: 16, fontWeight: "bold", color: "#333" },
    articleTime: { fontSize: 14, color: "#777", marginTop: 4 },

    // No Content Message
    noContentText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#777" },
});
