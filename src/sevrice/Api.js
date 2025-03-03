import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Thay đổi URL nếu cần

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getLoginPage =async() =>{
  try {
    const response = await api.get('/login');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu đăng nhập:', error);
    throw error;
  }
};

