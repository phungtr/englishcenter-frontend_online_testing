import React, { useState, useEffect } from 'react';
import '../../style/style/TeachingScheduleReport.css';
import Schedule from '../../component/Calender';
import Navbar from '../../component/Staffnavbar';
import { schedules} from '../../sevrice/Api';

const TeachingScheduleReport = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredTeachers, setFilteredTeacher] = useState([]);
  const [filters, setFilters] = useState({ lecturer: '', course: '', date: '' });


  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await schedules({});
        const formattedData = Array.isArray(data) ? data : [data]; // Đảm bảo dữ liệu là mảng
        setSchedule(formattedData);
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
    let filtered = schedule.filter(schedule => {
      return (
        (currentFilters.teacherName ? schedule.teacherName.toLowerCase().includes(currentFilters.teacherName.toLowerCase()) : true) &&
        (currentFilters.className ? schedule.className.toLowerCase().includes(currentFilters.className.toLowerCase()) : true)
      );
    });
    setFilteredTeacher(filtered);
  };
  const filteredSchedule = Array.isArray(TeachingScheduleReport) 
  ? TeachingScheduleReport.map(report => ({
      classId: report.classId,
      className: report.className,
      tcId: report.tcId,
      teacherName: report.teacherName,
      startTime: report.startTime,
      endTime: report.endTime,
      scheduleStatus: report.scheduleStatus
    })).filter(schedule => schedule.scheduleStatus === 1)
  : [];

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
        {filteredTeachers.map((schedule) => (
          <div key={schedule.tcId} className="schedule-item">
            <div className="course-title">{schedule.className}</div>
            <div className="course-info">
              <p>Giảng viên: {schedule.teacherName}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Phai truyen props sang de loc */}
      <Schedule schedule={filteredSchedule} />
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