import axios from "axios";

export default function axiosConfig(token) {
    axios.defaults.baseURL = import.meta.env.VITE_API
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.timeout = 10000;

    // axios.interceptors.response.use((res) => {
    //     return res && res.data ? res.data : res;
    // }, (error) => {
    //     console.log(error.request);
    //     Promise.reject(error);
    // });
}
