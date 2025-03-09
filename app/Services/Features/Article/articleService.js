import CONFIG from "@/app/Services/Configs/config";

const articleApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/articles`;
const cloudinaryBaseUrl = "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160743/MindSpace/";

export const getAllArticles = async () => {
    try {
        const response = await fetch(articleApiURL);
        const jsonData = await response.json();
        if (jsonData && jsonData.data) {
            return jsonData.data.map((item) => ({
                ...item,
                cloudinaryImageUrl: `${cloudinaryBaseUrl}${item.imagePath}`,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching article data:", error);
        throw error;
    }
};


