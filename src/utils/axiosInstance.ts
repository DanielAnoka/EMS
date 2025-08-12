import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.digital-receipt.westapp.com.ng/api',
});

export default axiosInstance;
