import React, { useState, useEffect } from 'react';
import '../../page/teacher/TeachingScheduleReport.css';
import Schedule from '../../component/Calender'
import Navbar from '../../component/pagebar';
// import { getTeachers } from '../../sevrice/Api';

const TeachingScheduleReport = () => {
  const [teacher, setTeacher] = useState([]);
  const [filteredTeachers, setFilteredTeacher] = useState([]);
  const [filters, setFilters] = useState({ lecturer: '', course: '', date: '' });


  // useEffect(() => {
  //   const loadTeacher = async () => {
  //     try {

  //       const data = await getTeachers({});
  //       setTeacher(data);

  //       if (data.token) {
  //         localStorage.setItem('token', data.token);
  //       }
  //     } catch (error) {
  //       console.error("Không thể tải thời khóa biểu:", error);
  //     }
  //   };

  //   loadTeachers();
  // }, []);
  useEffect(() => {
    // Fake data for demo
    const demoData = [
      { id: 1, lecturer: 'Nguyễn Văn Dưỡng', course: 'Tiếng anh cấp tốc', dateTime: '2025-02-25 07:55' },
      { id: 2, lecturer: 'Hà Xuân Bách', course: 'Tiếng anh trẻ em', dateTime: '2025-02-24 07:00' },
      { id: 3, lecturer: 'Vũ Minh Đăng', course: 'Luyện nghe và nói', dateTime: '2025-02-25 09:45' },
      { id: 4, lecturer: 'Lê Anh Nuôi', course: 'Tiếng anh chuyên ngành', dateTime: '2025-02-26 07:00' },
      { id: 5, lecturer: 'Đoàn Nguyễn Thành Hưng', course: 'Ngữ pháp nâng cao', dateTime: '2025-02-24 09:45' }
    ];
    setTeacher(demoData);
    setFilteredTeacher(demoData);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const applyFilters = (currentFilters) => {
    let filtered = teacher.filter(teacher => {
      return (
        (currentFilters.lecturer ? teacher.lecturer.toLowerCase().includes(currentFilters.lecturer.toLowerCase()) : true) &&
        (currentFilters.course ? teacher.course.toLowerCase().includes(currentFilters.course.toLowerCase()) : true) &&
        (currentFilters.date ? teacher.dateTime.startsWith(currentFilters.date) : true)
      );
    });
    setFilteredTeacher(filtered);
  };

  return (
    <div className="schedule-container">
      <div style={{ alignItems: "center", display: "flex" }}>  <Navbar /></div>
      <h1 className="schedule-title">Báo cáo lịch giảng dạy - {new Date().toLocaleDateString()}</h1>
      <div className="filter-container">
        <input type="text" name="lecturer" placeholder="Lọc theo giảng viên" value={filters.lecturer} onChange={handleFilterChange} />
        <input type="text" name="course" placeholder="Lọc theo khóa học" value={filters.course} onChange={handleFilterChange} />
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
      </div>
      <div className="schedule-grid">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="schedule-item">
            <div className="course-title">{teacher.course}</div>
            <div className="course-info">
              <p>Giảng viên: {teacher.lecturer}</p>
              <p>Thời gian: {teacher.dateTime}</p>
            </div>
          </div>
        ))}
      </div>
      <Schedule />
      {/* Footer */}
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

export default TeachingScheduleReport;