import { useState, useEffect } from 'react';
import { getBlogDetail } from './blogService';

const useBlogs = (blogId) => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            const data = await getBlogDetail(blogId);
            setBlog(data);
            setLoading(false);
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    return { blog, loading };
};

export default useBlogs;
