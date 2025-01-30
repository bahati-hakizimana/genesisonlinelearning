import axios from 'axios';
import apiUrl from './apiUrl';

const refreshToken = async () => {
  try {
    const response = await axios.post(`${apiUrl}/auth/refresh/`, {}, { withCredentials: true });
    return response.data.token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export default refreshToken;