import React, { useMemo } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Linking } from "react-native";
import RenderHtml from "react-native-render-html";
import useArticlesDetail from "@/app/Services/Features/Article/useArticlesDetail"; // Import the new hook

const { width } = Dimensions.get("window");

const ArticleDetail = ({ route }) => {
  const { articleId } = route.params;
  const { article, loading } = useArticlesDetail(articleId); // Use the custom hook here

  const memoizedHtmlSource = useMemo(() => ({
    html: article?.content || "<p>No content available</p>"
  }), [article?.content]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!article) {
    return <Text style={styles.errorText}>Article not found</Text>;
  }

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Article Thumbnail */}
      <Image source={{ uri: article.cloudinaryImageUrl }} style={styles.thumbnail} />

      {/* Article Title */}
      <Text style={styles.title}>{article.title}</Text>

      {/* Article Introduction */}
      <Text style={styles.introduction}>{article.introduction}</Text>

      {/* Content (Render HTML) */}
      <RenderHtml contentWidth={width} source={memoizedHtmlSource} />

      {/* Article Information Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.specialization}>
          <Text style={styles.boldText}>Specialization: </Text>
          {article.specializationName}
        </Text>
        <Text style={styles.manager}>
          <Text style={styles.boldText}>Managed by: </Text>
          {article.schoolManagerName}
        </Text>
        <View style={styles.separator} />
        <Text style={styles.articleUrl}>
          <Text style={styles.boldText}>Read more: </Text>
          <TouchableOpacity onPress={() => handleLinkPress(article.articleUrl)}>
            <Text style={styles.link}>{article.articleUrl}</Text>
          </TouchableOpacity>
        </Text>
      </View>

      {/* Additional Information (e.g., Author, Published At) */}
      <View style={styles.infoContainer}>
        <Text style={styles.author}>
          <Text style={styles.boldText}>Author: </Text>
          {article.authorName || "N/A"}
        </Text>
        <Text style={styles.publishedAt}>
          <Text style={styles.boldText}>Published At: </Text>
          {article.publishedAt || "Not available"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  thumbnail: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  introduction: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  infoContainer: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  specialization: {
    fontSize: 16,
    color: "#0277BD",
    marginBottom: 5,
  },
  manager: {
    fontSize: 16,
    color: "#0277BD",
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#B0BEC5",
    marginVertical: 10,
  },
  articleUrl: {
    fontSize: 16,
    color: "#0277BD",
  },
  link: {
    color: "#0277BD",
    textDecorationLine: "underline",
  },
  author: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  publishedAt: {
    fontSize: 16,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});

export default ArticleDetail;
