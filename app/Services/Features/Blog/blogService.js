import CONFIG from '@/app/Services/Configs/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const blogApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/blogs`;

export const getAllBlogs = async () => {
    try {
        const response = await fetch(blogApiURL);
        const jsonData = await response.json();
        const imageUrls = await AsyncStorage.getItem("blogImages");
        const jsonParseImageUrls = JSON.parse(imageUrls) || {}; 

        console.log("Stored Blog Images:", jsonParseImageUrls); 

        if (jsonData && jsonData.data) {
            return jsonData.data.map((item) => ({
                ...item,
                cloudinaryImageUrl: jsonParseImageUrls[item.id]
            }));
        }

        return [];
    } catch (error) {
        console.error("Error fetching blog data:", error);
        throw error;
    }
};

export const getBlogDetail = async (blogId) => {
    try {
        const response = await fetch(`${blogApiURL}/${blogId}`);
        if (!response.ok) throw new Error("Failed to fetch blog details");
        const blogData = await response.json();

        // Retrieve Cloudinary images from AsyncStorage
        const storedImages = await AsyncStorage.getItem("blogImages");
        const parsedImages = JSON.parse(storedImages) || {};

        return {
            ...blogData,
            cloudinaryImageUrl: parsedImages[blogId] || blogData.thumbnailUrl, // Use Cloudinary image if available
        };
    } catch (error) {
        console.error("Error fetching blog detail:", error);
        return null;
    }
};
