import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your backend URL if needed
  withCredentials: true,  // Allow cookies to be sent (for session management)
});

export default axiosInstance;