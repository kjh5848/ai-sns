import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_POSTIZ_API_URL || 'http://localhost:4200/api/v1';

export const postizApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API Key / JWT
postizApi.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('postiz_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const PostService = {
    createPost: async (data: { content: string, providers: string[], media?: string[], scheduleAt?: string }) => {
        const response = await postizApi.post('/posts', data);
        return response.data;
    },

    getPosts: async () => {
        const response = await postizApi.get('/posts');
        return response.data;
    },

    getChannels: async () => {
        const response = await postizApi.get('/channels');
        return response.data;
    }
};
