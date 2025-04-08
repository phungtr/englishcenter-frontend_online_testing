import React, { useState, useEffect } from 'react';
import '../../style/style/TeachingScheduleReport.css';
import Schedule from '../../component/Calender';
import Navbar from '../../component/Staffnavbar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import * as XLSX from "xlsx";
import { schedules, createSchedule } from '../../sevrice/Api';

const TeachingScheduleReport = () => {
  const [schedule, setSchedule] = useState([]);
  const [filters, setFilters] = useState({
    lecturer: "",
    course: "",
    date: new Date().toISOString().split("T")[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    classId: "",
    tcId: "",
    date: "",
    startTime: "",
    endTime: "",
    scheduleStatus: "ACTIVE",
  });
  const exportToExcel = () => {
    const filteredSchedule = schedule.map(({ style, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(filteredSchedule);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "ThoiKhoaBieu.xlsx");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };

      // Kiểm tra nếu startTime hoặc endTime thay đổi
      if (updatedForm.startTime && updatedForm.endTime) {
        if (!updatedForm.date) {
          setError("Vui lòng chọn ngày trước khi nhập thời gian!");
        } else {
          const startDateTime = new Date(`${updatedForm.date}T${updatedForm.startTime}:00`);
          const endDateTime = new Date(`${updatedForm.date}T${updatedForm.endTime}:00`);

          if (startDateTime >= endDateTime) {
            setError("Thời gian bắt đầu phải sớm hơn thời gian kết thúc!");
          } else {
            setError("");
          }
        }
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { date, startTime, endTime, ...rest } = form;
      const creatorId = localStorage.getItem("aUid");

      if (!creatorId) {
        alert("Lỗi: Không tìm thấy thông tin người tạo!");
        return;
      }

      const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();

      await createSchedule({
        creatorId,
        startTime: startDateTime,
        endTime: endDateTime,
        jsonData: JSON.stringify({ key: "value" }),
        ...rest,
      });

      alert("Tạo thời khóa biểu thành công!");
      setShowForm(false);
      setForm({ classId: "", tcId: "", date: "", startTime: "", endTime: "", scheduleStatus: "ACTIVE" });

      await loadSchedule(); // Cập nhật lại danh sách sau khi thêm
    } catch (error) {
      alert("Lỗi khi tạo thời khóa biểu!");
    }
  };
  const loadSchedule = async () => {
    try {
      const data = await schedules({});
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
      const month = e.getMonth() + 1;
      const year = e.getFullYear();
      setFilters((prev) => {
        const updatedFilters = { ...prev, date: e.toISOString().split("T")[0], month, year };
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
    const dayOfWeek = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return { start: startDate, end: endDate };
  };
  
  const applyFilters = (currentFilters) => {
    const { start, end } = getWeekRange(currentFilters.date);

    return schedule.filter(schedule => {
      const vietnamDate = new Date(schedule.startTime);
      vietnamDate.setHours(vietnamDate.getHours() + 7);
      const dateOnly = vietnamDate.toISOString().split("T")[0];

      return (
        (currentFilters.lecturer ? schedule.teacherName.toLowerCase().includes(currentFilters.lecturer.toLowerCase()) : true) &&
        (currentFilters.course ? schedule.className.toLowerCase().includes(currentFilters.course.toLowerCase()) : true) &&
        (dateOnly >= start.toISOString().split("T")[0] && dateOnly <= end.toISOString().split("T")[0]) &&
        (vietnamDate.getMonth() + 1 === currentFilters.month) &&
        (vietnamDate.getFullYear() === currentFilters.year)
      );
    });
  };

  const filteredSchedule = Array.isArray(schedule)
    ? schedule.map(report => ({
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
      <div className='schedule-middle'>
        <div className='right-container'>
          <div className="container">
            <div className="container-open-form">
              <button onClick={() => setShowForm(true)} className="open-form-button">
                Tạo thời khóa biểu
              </button>
              <div className="button-container" >
                <button onClick={exportToExcel} className="export-button">Xuất Excel</button>
              </div>
            </div>

            {showForm && (
              <div className="form-overlay">
                <div className="form-container">
                  <h2>Thêm thời khóa biểu</h2>
                  <form onSubmit={handleSubmit}>
                    <input type="date" name="date" placeholder="Ngày" value={form.date} onChange={handleChange} required className="input-field" />
                    <input type="time" name="startTime" placeholder="Giờ bắt đầu" value={form.startTime} onChange={handleChange} required className="input-field" />
                    <input type="time" name="endTime" placeholder="Giờ kết thúc" value={form.endTime} onChange={handleChange} required className="input-field" />
                    <input name="classId" placeholder="Mã lớp" value={form.classId} onChange={handleChange} required className="input-field" />
                    <input name="tcId" placeholder="Mã giáo viên" value={form.tcId} onChange={handleChange} required className="input-field" />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-button">Xác nhận</button>
                    <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Hủy</button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <div className="filter-container">
            <div className="filter-class">
              <input type="text" name="lecturer" placeholder="Lọc theo giảng viên" value={filters.lecturer} onChange={handleFilterChange} />
              <input type="text" name="course" placeholder="Lọc theo khóa học" value={filters.course} onChange={handleFilterChange} />
            </div>
            <div className="filter-Weekday">
              <DatePicker
                inline
                selected={filters.date ? new Date(filters.date) : null}
                onChange={handleFilterChange}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
              />
            </div>
          </div>
        </div>
        <Schedule schedule={filteredSchedule} />
      </div>
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