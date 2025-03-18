import React, { useState, useEffect } from 'react';
import '../../style/style/TeachingScheduleReport.css';
import Schedule from '../../component/Calender'
import Navbar from '../../component/Staffnavbar';
import { schedules } from '../../sevrice/Api';

const TeachingScheduleReport = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredTeachers, setFilteredTeacher] = useState([]);
  const [filters, setFilters] = useState({ lecturer: '', course: '', date: '' });


  useEffect(() => {
    const loadSchedule = async () => {
      try {
        // Gọi API, truyền đối tượng rỗng nếu không cần tham số
        const data = await schedules({});
        setSchedule(data);
        console.log(data);
        // Nếu dữ liệu trả về có token, bạn có thể lưu vào localStorage:
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      } catch (error) {
        console.error("Không thể tải thời khóa biểu:", error);
      }
    };

    loadSchedule();
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
    let filtered = schedule.filter(teacher => {
      return (
        (currentFilters.teacherName ? teacher.teacherName.toLowerCase().includes(currentFilters.teacherName.toLowerCase()) : true) &&
        (currentFilters.className ? teacher.className.toLowerCase().includes(currentFilters.className.toLowerCase()) : true)
      );
    });
    setFilteredTeacher(filtered);
  };

  return (
    <div className="schedule-container">
      <div style={{ alignItems: "center", display: "flex" }}>  <Navbar /></div>
      <h1 className="schedule-title" >Báo cáo lịch giáo viên</h1>
      <div className="filter-container">
        <input type="text" name="lecturer" placeholder="Lọc theo giảng viên" value={filters.teacherName} onChange={handleFilterChange} />
        <input type="text" name="course" placeholder="Lọc theo khóa học" value={filters.className} onChange={handleFilterChange} />
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
      </div>
      <div className="schedule-grid">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.tcId} className="schedule-item">
            <div className="course-title">{teacher.className}</div>
            <div className="course-info">
              <p>Giảng viên: {teacher.teacherName}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Phai truyen props sang de loc */}
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