import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Attach JWT to every request automatically
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Global response error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('jwt')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)