import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Thay đổi URL nếu cần

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};
export const getStudents = async (Student) =>  {
  try {
    const response = await api.post('/students/all', {Student});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};

export const getTeachers = async (Teacher) =>  {
  try {
    const response = await api.post('/teachers/all', {Teacher});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};
export const classes = async (Classes) =>  {
  try {
    const response = await api.post('/classes/all', {Classes});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};

export const fetchschedule = async (Schedule) =>  {
  try {
    const response = await api.post('/schedule/getAll', {Schedule});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};