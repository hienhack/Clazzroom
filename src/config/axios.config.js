import axios from "axios";

export default function axiosConfig() {
    axios.defaults.baseURL = 'https://be-web-adv.vercel.app/api/';
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    axios.defaults.timeout = 5000;

    // axios.interceptors.response.use((res) => {
    //     return res && res.data ? res.data : res;
    // }, (error) => {
    //     console.log(error.request);
    //     Promise.reject(error);
    // });
}
