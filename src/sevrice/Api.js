import axios from 'axios';

const API_BASE_URL = 'http://26.253.189.203:8080/api'; // Thay đổi URL nếu cần

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
    const response = await api.get('/students/all', {params:Student});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};

export const getTeachers = async (Teacher) =>  {
  try {
    const response = await api.get('/teachers/all', {params: Teacher});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};
export const classes = async (Classes) =>  {
  try {
    const response = await api.get('/classes/all', {Classes});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};

export const schedules = async (schedule) => {
  try {
    const response = await api.get('/schedule/getAll', { params: schedule });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};