import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api'; // Thay đổi URL nếu cần

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
export const getMyClasses = async (studentId) => {
  try {
    const response = await api.get(`/classes/my-classes`, {
      params: { studentId },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lớp:', error);
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
export const deleteTeacherById = async (tcId) => {
  try {
    const response = await api.delete(`/delete/${tcId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};
export const deleteStudentById = async (svId) => {
  try {
    const response = await api.delete(`/delete/${svId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
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
  const response = await api.get(`/marks/class/${classId}`);
  return response.data;
};
export const getMarksBystudentId = async (studentId) => {
  const response = await api.get(`/marks/student/${studentId}`);
  return response.data;
};
export const updateMark = async (markId, markDto) => { 
  const response = await api.put(`/marks/update/${markId}`, markDto); 
  return response.data;
};
// Cập nhật điểm và nhận xét học sinh
export const updateStudentMark = async (studentId, markDto) => {
  const response = await api.put(`/marks/student/${studentId}`, markDto);
  return response.data;
};
export const createLesson = async (lessonDTO) => {
  try {
    const response = await api.post('/lessons', lessonDTO);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo bài học:', error);
    throw error;
  }
};

export const getLessonById = async (id) => {
  try {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy bài học theo ID:', error);
    throw error;
  }
};

export const getAllLessons = async () => {
  try {
    const response = await api.get('/lessons');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả bài học:', error);
    throw error;
  }
};

export const updateLesson = async (id, lessonDTO) => {
  try {
    const response = await api.put(`/lessons/${id}`, lessonDTO);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật bài học:', error);
    throw error;
  }
};

export const deleteLesson = async (id) => {
  try {
    await api.delete(`/lessons/${id}`);
  } catch (error) {
    console.error('Lỗi khi xóa bài học:', error);
    throw error;
  }
};

// Teaching Content API
export const getAllTeachingContent = async () => {
  try {
    const response = await api.get('/teaching-content/getAll');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy toàn bộ nội dung giảng dạy:', error);
    throw error;
  }
};

export const getTeachingContentByClassId = async (classId) => {
  try {
    const response = await api.get(`/teaching-content/getAllByClassId/${classId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy nội dung giảng dạy theo lớp ${classId}:`, error);
    throw error;
  }
};
export const createTeachingContentWithUpload = async (data) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file); // File dạng Blob/File
    formData.append('classId', data.classId);
    formData.append('teacherId', data.teacherId);
    formData.append('lessonId', data.lessonId);
    formData.append('title', data.title);
    formData.append('content', data.content);

    const response = await api.post('/teaching-content/create-with-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo nội dung giảng dạy kèm upload:', error);
    throw error;
  }
};