import CONFIG from "@/app/Services/Configs/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const articleApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/articles`;

export const getAllArticles = async () => {
    try {
        const response = await fetch(articleApiURL);
        const jsonData = await response.json();
        console.log(jsonData);
        const imageUrls = await AsyncStorage.getItem("articleImages");
        const jsonParseArticleImages = JSON.parse(imageUrls);
        if (jsonData && jsonData.data) {
            return jsonData.data.map((item) => ({
                ...item,
                cloudinaryImageUrl: jsonParseArticleImages[item.id],
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching article data:", error);
        throw error;
    }
};


