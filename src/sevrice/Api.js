import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api'; // Thay đổi URL nếu cần

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
export const getAllAccounts = async () => {
  try {
    const response = await api.get('/account/getAll');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    throw error;
  }
};
export const createAccount = async (accountData) => {
  try {
    const response = await api.post('/account/create', accountData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error);
    throw error;
  }
};
export const getAllClasses = async () => {
  try {
    const response = await api.get('/classes/getAll');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lớp:', error);
    throw error;
  }
};
export const findClasses = async (classId) => {
  try {
    const response = await api.get(`/classes/find/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lớp:', error);
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
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post("/schedule/create", scheduleData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo thời khóa biểu:", error);
    throw error;
  }
};
export const ScheduleStudent = async (svId) => {
  try {
    const response = await api.get(`/schedule/student/${svId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thời khóa biểu của học sinh:", error);
    throw error;
  }
};

export const ScheduleTeacher = async (tcId) => {
  try {
    const response = await api.get(`/schedule/teacher/${tcId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thời khóa biểu của giáo viên:", error);
    throw error;
  }
};
export const addStudentToClass = async (studentData) => {
  try {
    const response = await api.post('/learning-progress/addStudent', studentData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm học viên:', error);
    throw error;
  }
};

// Gọi API để lấy danh sách học viên trong lớp
export const getAllStudentsInClass = async (classId) => {
  try {
    const response = await api.get(`/learning-progress/allStudentsInClass/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học viên:', error);
    throw error;
  }
};
// Lấy tất cả nhân viên
export const getAllStaff = async () => {
  try {
    const response = await api.get('/staff/getAll');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    throw error;
  }
};

export const getAllStudents = async (student) => {
  try {
    const response = await api.get('/students/all', { params: student });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sinh viên:', error);
    throw error;
  }
};
export const getAllTeachers = async (teacher) => {
  try {
    const response = await api.get('/teachers/all', { params: teacher });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách giáo viên:', error);
    throw error;
  }
};
export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/teachers/create', teacherData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm giáo viên:', error);
    throw error;
  }
};

// Cập nhật giáo viên theo ID
export const updateTeacher = async (tcId, updatedData) => {
  try {
    const response = await api.put(`/teachers/update/${tcId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật giáo viên:', error);
    throw error;
  }
};
export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/students/create', studentData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm sinh viên:', error);
    throw error;
  }
};

// Cập nhật sinh viên theo ID
export const updateStudent = async (svId, updatedData) => {
  try {
    const response = await api.put(`/students/update/${svId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sinh viên:', error);
    throw error;
  }
};
export const marks = async () =>{
  try {
    const response = await api.get(`/marks/all`);
    return response.data;
  }catch (error) {
  console.error('Lỗi khi cập nhật sinh viên:', error);
  throw error;
  }
};
export const getMarksByClassId = async (classId) => {
  const response = await api.get(`/mark/class/${classId}`);
  return response.data;
};
export const getMarksBystudentId = async (studentId) => {
  const response = await api.get(`/mark/student/${studentId}`);
  return response.data;
};
// Cập nhật điểm và nhận xét học sinh
export const updateStudentMark = async (studentId, markDto) => {
  const response = await api.put(`/mark/student/update/${studentId}`, markDto);
  return response.data;
};