import { useState, useEffect } from "react";
import { getAllArticles } from "./articleService";

const useArticles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getAllArticles();
                setArticles(data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, []);

    return { articles };
};

export default useArticles;
