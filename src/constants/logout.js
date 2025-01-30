import axios from 'axios';
import apiUrl from './apiUrl';

const logout = async (setIsLoading) => {
    setIsLoading(true);
    try {
        await axios.post(`${apiUrl}api/logout/`, {
            refresh: localStorage.getItem('refreshToken'),
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
    } catch (error) {
        console.error('Error logging out:', error);
    } finally {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        document.cookie = 'authToken=; Max-Age=0; path=/;'; // Clear the cookie
        setIsLoading(false);
        window.location.href = '/';
    }
};

export default logout;