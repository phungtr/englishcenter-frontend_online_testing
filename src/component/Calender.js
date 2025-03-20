/* eslint-disable react/prop-types */
import React, {useState} from "react";
import "../style/style/Calender.css";
import * as XLSX from "xlsx";
import { createSchedule } from "../sevrice/Api";

const Schedule = ({ schedule })  => {
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    className: "",
    teacherName: "",
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
    
        // Gộp ngày với giờ
        const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
        const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();
    
        const newSchedule = await createSchedule({
          ...rest,
          startTime: startDateTime,
          endTime: endDateTime,
        });
    
        console.log("Thời khóa biểu đã tạo:", newSchedule);
        setShowForm(false);
        alert("Tạo thời khóa biểu thành công!");
      } catch (error) {
        alert("Lỗi khi tạo thời khóa biểu!");
      }
    };
    
  const exportToExcel = () => {
    const filteredSchedule = schedule.map(({ style, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(filteredSchedule);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "ThoiKhoaBieu.xlsx");
  };

  const days = [ "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy","Chủ Nhật"];
  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
  const pxPerMinute = 2;

  const extractTime = (isoTime) => {
    if (!isoTime) return ""; // Trả về chuỗi rỗng nếu isoTime không có giá trị
    return isoTime.split("T")[1].substring(0, 5);
  };
  const timeToPosition = (time) => { 
    const [hour, minute] = time.split(":").map(Number);
    return ((hour - 7) * 60 + minute) * pxPerMinute;
  };

  const getDayIndex = (startTime) => {
    if (!startTime) return -1;
    
    const localDate = new Date(startTime);
    localDate.setHours(localDate.getHours() + 7); // Chuyển sang giờ Việt Nam
    
    const dayOfWeek = localDate.getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
};
  return (
<div className="schedule-fixed">
      <h2 className="schedule-title">Thời khóa biểu</h2>
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
              <input name="className" placeholder="Lớp" value={form.className} onChange={handleChange} required className="input-field" />
              <input name="teacherName" placeholder="Tên giáo viên" value={form.teacherName} onChange={handleChange} required className="input-field" />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-button">Xác nhận</button>
              <button type="button" onClick={() => setShowForm(false)} className="cancel-button">Hủy</button>
            </form>
          </div>
        </div>
      )}
    </div>
      <div className="Schedule-container">
      <div className="time-cell-row">
        <div className="time-cell">GMT+7</div>
        {days.map((day) => {
            schedule.find(e => e.day === day); // Use the state variable 'schedule'
            return (
              <div key={day} className="day-header">
                <div className="day">{day}</div>
              </div>
            );
          })}
      </div>

       <div className="schedule-griD">
          <div className="Time-slot">
            {timeSlots.map((time, index) => (
              <div key={index} className="time-slot">
                {time}____
              </div>
            ))}
          </div>

          <div className="calendar">
          {schedule.map((schedule, index) => {
            const startTimeValue = extractTime(schedule?.startTime);
            const endTimeValue = extractTime(schedule?.endTime);
            const top = timeToPosition(startTimeValue);
            const height = timeToPosition(endTimeValue) - top;
            const dayIndex = getDayIndex(schedule?.startTime);
            const eventClass = `event ${schedule.className.toLowerCase().replace(/\s+/g, "-")}`;
            console.log(dayIndex);
            return (
                <div
                    key={index}
                    className={eventClass}
                    style={{
                        gridColumnStart: dayIndex + 2,
                        top: `${top}px`,
                        height: `${height}px`,
                        position: "absolute",
                        left: `${dayIndex * 255}px`,
                        width: "255px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                >
                  <div className="event-content">
                    <div className="event-title" style={{ fontSize: "16px", fontWeight: "bold",textAlign :"center",margin:"20px 0 0 0"}}>{schedule.className}</div>
                    <div className="Des">
                    <div className="event-time" style={{margin:"10px 0 0 0"}}>{startTimeValue} - {endTimeValue}</div>
                    <div className="event-teacher">{schedule.teacherName}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="button-container" >
<button onClick={exportToExcel} className="export-button">Xuất Excel</button>
      </div>
    </div>
  );
};

export default Schedule;