import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Thay đổi URL nếu cần

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTeachingScheduleReports = async () => {
  try {
    const response = await api.get('/teaching-schedule-reports');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu báo cáo lịch giảng dạy:', error);
    throw error;
  }
};
export const getLoginPage =async() =>{
  try {
    const response = await api.get('/Login');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu đăng nhập:', error);
    throw error;
  }
};

