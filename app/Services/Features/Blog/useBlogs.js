import { useState, useEffect, useRef } from "react";
import { getAllBlogs } from "./blogService";

const useBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getAllBlogs();
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        if (blogs.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % blogs.length);
                if (blogs.length > 0 && activeIndex < blogs.length) {
                    flatListRef.current?.scrollToIndex({ index: activeIndex, animated: true });
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [blogs, activeIndex]);

    return { blogs, activeIndex, setActiveIndex, flatListRef };
};

export default useBlogs;
