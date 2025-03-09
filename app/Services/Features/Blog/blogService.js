import CONFIG from '@/app/Services/Configs/config';

const blogApiURL = `${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/blogs`;
const cloudinaryBaseUrl = "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160743/MindSpace/";

export const getBlogDetail = async (blogId) => {
    try {
        const response = await fetch(`${CONFIG.baseUrl}/${CONFIG.apiVersion}/resources/blogs/${blogId}`);
        if (!response.ok) throw new Error("Failed to fetch blog details");
        return await response.json();
    } catch (error) {
        console.error("Error fetching blog detail:", error);
        return null;
    }
};

export const getAllBlogs = async () => {
    try {
        const response = await fetch(blogApiURL);
        const jsonData = await response.json();
        if (jsonData && jsonData.data) {
            return jsonData.data.map((item) => ({
                ...item,
                cloudinaryImageUrl: `${cloudinaryBaseUrl}${item.imagePath}`,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching blog data:", error);
        throw error;
    }
};
