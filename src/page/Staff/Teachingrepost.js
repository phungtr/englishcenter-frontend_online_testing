import React, { useState, useEffect, useRef } from 'react';
import '../../style/style/TeachingScheduleReport.css';
import Schedule from '../../component/Calender';
import Navbar from '../../component/Staffnavbar';
import { schedules, createSchedule } from '../../sevrice/Api';

const TeachingScheduleReport = () => {
  const [schedule, setSchedule] = useState([]);
  const [filters, setFilters] = useState({ lecturer: '', course: '', date: '' });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const dateInputRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dateInputRef.current) {
        dateInputRef.current.focus(); // Focus vào input, giúp hiển thị date picker trên một số trình duyệt
      }
    }, 500); // Delay một chút để tránh lỗi trình duyệt chặn

    return () => clearTimeout(timer);
  }, []);
  const [form, setForm] = useState({
    classId: "",
    tcId: "",
    date: "",
    startTime: "",
    endTime: "",
    scheduleStatus: "ACTIVE",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };

      // Kiểm tra nếu startTime hoặc endTime thay đổi
      if (updatedForm.date && updatedForm.startTime && updatedForm.endTime) {
        const startDateTime = new Date(`${updatedForm.date}T${updatedForm.startTime}:00`);
        const endDateTime = new Date(`${updatedForm.date}T${updatedForm.endTime}:00`);

        if (startDateTime >= endDateTime) {
          setError("Thời gian bắt đầu phải sớm hơn thời gian kết thúc!");
        } else {
          setError("");
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
      // Gộp ngày với giờ
      const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
      const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();

      const newSchedule = await createSchedule({

        creatorId,
        startTime: startDateTime,
        endTime: endDateTime,
        jsonData: JSON.stringify({ key: "value" }),
        ...rest,
      });

      console.log("Thời khóa biểu đã tạo:", newSchedule);
      setShowForm(false);
      alert("Tạo thời khóa biểu thành công!");
    } catch (error) {
      alert("Lỗi khi tạo thời khóa biểu!");
    }
  };
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
      const updatedFilters = {
        ...prev,
        [name]: value
      };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };
  const applyFilters = (currentFilters) => {
    return schedule.filter(schedule => {
      const vietnamDate = new Date(schedule.startTime).toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

      return (
        (currentFilters.lecturer ? schedule.teacherName.toLowerCase().includes(currentFilters.lecturer.toLowerCase()) : true) &&
        (currentFilters.course ? schedule.className.toLowerCase().includes(currentFilters.course.toLowerCase()) : true) &&
        (currentFilters.date ? vietnamDate === currentFilters.date : true) // So sánh ngày
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
            </div>

            {showForm && (
              <div className="form-overlay">
                <div className="form-container">
                  <h2>Thêm thời khóa biểu</h2>
                  <form onSubmit={handleSubmit}>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required className="input-field" />
                    <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required className="input-field" />
                    <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required className="input-field" />
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
            <input type="text" name="lecturer" placeholder="Lọc theo giảng viên" value={filters.teacherName} onChange={handleFilterChange} />
            <input type="text" name="course" placeholder="Lọc theo khóa học" value={filters.className} onChange={handleFilterChange} />
            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} ref={dateInputRef} />
          </div>
        </div>

        {/* Phai truyen props sang de loc */}
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