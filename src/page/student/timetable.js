import React, { useState, useEffect } from 'react';
import Schedule from '../../component/Calender';
import { schedules, getAllClasses, getAllStudents } from '../../sevrice/Api';
import StudentNavbar from '../../component/StudentNavbar';

const TimeTable = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [studentClasses, setStudentClasses] = useState([]);
  const [filters, setFilters] = useState({ className: '', date: '' });
  const [studentId, setStudentId] = useState(null);
  
  useEffect(() => {
    console.log('Student ID:', studentId);
  }, [studentId]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');  
        if (!username) {
          console.error('Không tìm thấy username trong localStorage!');
          return;
        }
  
        // Lấy danh sách sinh viên
        const students = await getAllStudents();
        console.log('students:', students);
        if (!students || students.length === 0) {
          console.error('Không thể tải danh sách sinh viên!');
          return;
        }
  
        // Tìm sinh viên khớp với username
        const loggedStudent = students.find(s => s.account?.aUid === username);
        console.log('loggedStudent:', loggedStudent);
        if (!loggedStudent) {
          console.error('Không tìm thấy sinh viên với username:', username);
          return;
        }
  
        console.log('loggedStudent:', loggedStudent);
        setStudentId(loggedStudent.svId);
  
        // Lấy danh sách lớp
        const classData = await getAllClasses();
        if (!classData) {
          console.error('Không thể tải danh sách lớp!');
          return;
        }
  
        const studentClasses = classData.filter(cls => 
          cls.students?.some(s => s.svId === loggedStudent.svId)
        );
        setStudentClasses(studentClasses);
  
        // Lấy danh sách lịch học
        const scheduleData = await schedules({});
        if (!scheduleData) {
          console.error('Không thể tải lịch học!');
          return;
        }
  
        const studentSchedule = scheduleData.filter(item =>
          studentClasses.some(cls => cls.classId === item.classId) && item.scheduleStatus === 1
        );
  
        setSchedule(studentSchedule);
        setFilteredSchedule(studentSchedule);
  
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const applyFilters = (currentFilters) => {
    const filtered = schedule.filter(item => (
      (currentFilters.className ? item.className.toLowerCase().includes(currentFilters.className.toLowerCase()) : true) &&
      (currentFilters.date ? item.startTime.startsWith(currentFilters.date) : true)
    ));
    setFilteredSchedule(filtered);
  };

  return (
    <div className="schedule-container">
      <StudentNavbar />
      <div className='schedule-middle'>
        <div className='right-container'>
          <div className="filter-container">
            <select name="className" value={filters.className} onChange={handleFilterChange}>
              <option value="">Tất cả lớp</option>
              {studentClasses.map(cls => (
                <option key={cls.classId} value={cls.className}>{cls.className}</option>
              ))}
            </select>
            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
          </div>
        </div>
        <Schedule schedule={filteredSchedule} />
      </div>
      <footer className="footer-container">
        <div className="footer-section">
          <h3>Quản lý trung tâm tiếng Anh</h3>
          <p>Hệ thống quản lý hiện đại và tiện lợi</p>
        </div>
        <div className="footer-section">
          <h4>Bạn cần hỗ trợ</h4>
          <p>0867 460 906</p>
          <p>Địa chỉ: Hà Đông, Hà Nội, Việt Nam</p>
          <p>Email: phungtra@gmail.com</p>
        </div>
        <div className="footer-section">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/categories">Danh mục</a></li>
            <li><a href="/news">Tin tức</a></li>
            <li><a href="/help">Hướng dẫn sử dụng</a></li>
          </ul>
        </div>
        <div className="footer-bottom">
          <p>&copy; Bản quyền thuộc về Phùng Quang Trà | Cung cấp bởi Nhóm 1</p>
        </div>
      </footer>
    </div>
  );
};

export default TimeTable;
