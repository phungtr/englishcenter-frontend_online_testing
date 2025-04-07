import React, { useState, useEffect } from 'react';
import '../../style/style/TeachingScheduleReport.css';
import Scheduleteacher from '../../component/TeacherTime';
import TeacherNavbar from '../../component/Teachernavbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ScheduleTeacher, getAllAccounts, getAllTeachers } from '../../sevrice/Api';

const TeachingSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split("T")[0] // Lấy ngày hiện tại theo YYYY-MM-DD
  });

  const loadSchedule = async () => {
    try {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        alert("Lỗi: Không tìm thấy thông tin đăng nhập!");
        return;
      }

      const accounts = await getAllAccounts();
      const account = accounts.find(acc => acc.aUid === username && acc.aPwd === password);

      if (!account) {
        alert("Lỗi: Tài khoản không hợp lệ!");
        return;
      }

      const teachers = await getAllTeachers();
      const teacher = teachers.find(teach => teach.aId === account.aId);

      if (!teacher) {
        alert("Lỗi: Không tìm thấy giáo viên!");
        return;
      }

      const data = await ScheduleTeacher(teacher.tcId);
      const formattedData = Array.isArray(data) ? data : [data]; // Đảm bảo dữ liệu là mảng
      setSchedule(formattedData);
    } catch (error) {
      console.error("Không thể tải thời khóa biểu:", error);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleFilterChange = (e) => {
    if (e instanceof Date) {
      // Nếu e là Date (từ DatePicker), cập nhật filters.date
      setFilters((prev) => {
        const updatedFilters = { ...prev, date: e.toISOString().split("T")[0] };
        applyFilters(updatedFilters);
        return updatedFilters;
      });
    } else {
      // Nếu e là sự kiện từ input (name, value)
      const { name, value } = e.target;
      setFilters((prev) => {
        const updatedFilters = { ...prev, [name]: value };
        applyFilters(updatedFilters);
        return updatedFilters;
      });
    }
  };

  const getWeekRange = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // Chủ nhật = 0, Thứ hai = 1, ..., Thứ bảy = 6
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Lấy Thứ Hai đầu tuần
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Lấy Chủ Nhật cuối tuần
    return { start: startDate, end: endDate };
  };

  const applyFilters = (currentFilters) => {
    const { start, end } = getWeekRange(currentFilters.date);
    return schedule.filter(schedule => {
      const vietnamDate = new Date(schedule.startTime);
      vietnamDate.setHours(vietnamDate.getHours() + 7);
      const dateOnly = vietnamDate.toISOString().split("T")[0];
      return (
        (dateOnly >= start.toISOString().split("T")[0] && dateOnly <= end.toISOString().split("T")[0])
      );
    });
  };

  const filteredSchedule = Array.isArray(schedule)
  ? schedule.map(report => ({
      scheduleId: report.scheduleId,
      classId: report.classId,
      className: report.className,
      startTime: report.startTime,
      endTime: report.endTime,
      classDescription: report.classDescription
    }))
  : [];

  return (
    <div className="schedule-container">
      <div style={{ alignItems: "center", display: "flex" }}> <TeacherNavbar /></div>
      <div className='schedule-middle'>
        <div className='right-container'>
          <div className="container">
            <div className="filter-container">
              <div className="filter-Weekday">
                <DatePicker selected={new Date(filters.date)} onChange={handleFilterChange} inline dateFormat="yyyy-MM-dd" className="custom-datepicker" />
              </div>
            </div>
          </div>
        </div>
        <Scheduleteacher schedule={filteredSchedule} />
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
          <p>© Bản quyền thuộc về Phùng Quang Trà
            Cung cấp bởi Nhóm 1</p>
        </div>
      </footer>
    </div>
  );
};

export default TeachingSchedule;
