import { useState, useEffect } from "react";
import CONFIG from '@/app/Services/Configs/config'
import AsyncStorage from "@react-native-async-storage/async-storage";

const useArticlesDetail = (articleId) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/articles/${articleId}`
        );
        const articleData = await response.json();

        // If image URL is stored in AsyncStorage, combine it with article data
        const imageUrls = await AsyncStorage.getItem("articleImages");
        const parsedImages = JSON.parse(imageUrls);

        if (articleData && parsedImages) {
          const updatedArticle = {
            ...articleData,
            cloudinaryImageUrl: parsedImages[articleData.id] || articleData.cloudinaryImageUrl,
          };
          setArticle(updatedArticle);
        }
      } catch (error) {
        console.error("Error fetching article detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticleDetail();
    }
  }, [articleId]);

  return { article, loading };
};

export default useArticlesDetail;
