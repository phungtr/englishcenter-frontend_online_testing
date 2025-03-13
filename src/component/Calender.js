import React, {useEffect,useState} from "react";
import "../style/style/Calender.css";
import * as XLSX from "xlsx";
import { schedules } from "../sevrice/Api";
const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  console.log(schedule,"schedule");

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
  // const schedule = [
  //   { day: "Tue", date: "25/02/2025", startTime: "07:55", endTime: "09:40", className: "Tiếng anh cấp tốc", teacherName: "Nguyễn Văn Dưỡng " },
  //   { day: "Tue", date: "25/02/2025", startTime: "09:45", endTime: "12:25", className: "Luyện nghe và nói", teacherName: "Vũ Minh Đăng" },
  //   { day: "Wed", date: "26/02/2025", startTime: "07:00", endTime: "09:40", className: "Tiếng anh chuyên nghành", teacherName: "Lê Anh Nuôi "},
  //   { day: "Thu", date: "27/02/2025", startTime: "07:00", endTime: "09:40", className: "Tiếng anh trẻ em", teacherName: "Hà Xuân Bách" },
  //   { day: "Thu", date: "27/02/2025", startTime: "09:45", endTime: "11:30", className: "Luyện nghe và nói", teacherName: "Vũ Minh Đăng" },
  //   { day: "Fri", date: "28/02/2025", startTime: "07:00", endTime: "08:45", className: "Tiếng anh chuyên nghành",teacherName: "Lê Anh Nuôi" },
  //   { day: "Fri", date: "28/02/2025", startTime: "08:50", endTime: "11:30", className: "Tiếng anh cấp tốc", teacherName: "Nguyễn Văn Dưỡng" }
  // ];

  const exportToExcel = () => {
    const filteredSchedule = schedule.map(({ style, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(filteredSchedule);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "ThoiKhoaBieu.xlsx");
  };

  const days = [ "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy","Chủ Nhật"];
  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
  const pxPerMinute = 1;

  const timeToPosition = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return ((hour - 7) * 60 + minute) * pxPerMinute;
  };

  const getDayIndex = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Thứ Hai = 0, ..., Chủ Nhật = 6
  };

  
  return (
<div className="schedule-fixed">
      <h2 className="schedule-title">Thời khóa biểu</h2>
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
              const top = timeToPosition(schedule?.startTime);
              const height = timeToPosition(schedule?.endTime) - top;
              const dayIndex = getDayIndex(schedule?.date);
              const eventClass = `event ${schedule.className.toLowerCase().replace(/\s+/g, "-")}`;
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
                    <div className="event-time" style={{margin:"10px 0 0 0"}}>{schedule.startTime} - {schedule.endTime}</div>
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