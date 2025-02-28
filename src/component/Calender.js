import React from "react";
import "../style/style/Calender.css";
import * as XLSX from "xlsx";

const Schedule = () => {
  const schedule = [
    { day: "Mon", date: "24/02/2025", start: "07:00", end: "09:40", period: "Tiết 1-3", title: "Tiếng anh trẻ em", teacher: "Hà Xuân Bách", style: "event game" },
    { day: "Mon", date: "24/02/2025", start: "09:45", end: "12:25", period: "Tiết 4-6", title: "Ngữ pháp nâng cao", teacher: "Đoàn Nguyễn Thành Hưng", style: "event uiux" },
    { day: "Tue", date: "25/02/2025", start: "07:55", end: "09:40", period: "Tiết 2-3", title: "Tiếng anh cấp tốc", teacher: "Nguyễn Văn Dưỡng ", style: "event design" },
    { day: "Tue", date: "25/02/2025", start: "09:45", end: "12:25", period: "Tiết 4-6", title: "Luyện nghe và nói", teacher: "Vũ Minh Đăng", style: "event requirement" },
    { day: "Wed", date: "26/02/2025", start: "07:00", end: "09:40", period: "Tiết 1-3", title: "Tiếng anh chuyên nghành", teacher: "Lê Anh Nuôi ", style: "event testing" },
    { day: "Thu", date: "27/02/2025", start: "07:00", end: "09:40", period: "Tiết 1-3", title: "Tiếng anh trẻ em", teacher: "Hà Xuân Bách", style: "event game" },
    { day: "Thu", date: "27/02/2025", start: "09:45", end: "11:30", period: "Tiết 4-5", title: "Luyện nghe và nói", teacher: "Vũ Minh Đăng", style: "event requirement" },
    { day: "Fri", date: "28/02/2025", start: "07:00", end: "08:45", period: "Tiết 1-2", title: "Tiếng anh chuyên nghành", teacher: "Lê Anh Nuôi", style: "event testing" },
    { day: "Fri", date: "28/02/2025", start: "08:50", end: "11:30", period: "Tiết 3-5", title: "Tiếng anh cấp tốc", teacher: "Nguyễn Văn Dưỡng", style: "event design" }
  ];

  const exportToExcel = () => {
    const filteredSchedule = schedule.map(({ style, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(filteredSchedule);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "ThoiKhoaBieu.xlsx");
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
  const pxPerMinute = 1;

  const timeToPosition = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return ((hour - 7) * 60 + minute) * pxPerMinute;
  };
  
  return (
    <div className="schedule-fixed">
      <h2 className="schedule-title">Thời khóa biểu</h2>
      <div className="Schedule-container">
      <div className="time-cell-row">
        <div className="time-cell">GMT+7</div>
        {days.map((day) => {
          const event = schedule.find(e => e.day === day); // Lấy ngày từ sự kiện đầu tiên của ngày đó
          return (
            <div key={day} className="day-header">
              <div className="day">{day}</div>
              <div className="date">{event ? event.date : ""}</div>
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
          {schedule.map((event, index) => {
              const top = timeToPosition(event.start);
              const height = timeToPosition(event.end) - top;
              const dayIndex = days.indexOf(event.day);

              return (
                <div
                  key={index}
                  className={`event ${event.style}`}
                  style={{
                    gridColumnStart: dayIndex + 2,
                    top: `${top}px`,
                    height: `${height}px`,
                    position: "absolute",
                    left: `${dayIndex * 356.5}px`,
                    width: "356.5px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div className="event-content">
                    <div className="event-title" style={{ fontSize: "16px", fontWeight: "bold",textAlign :"center",margin:"20px 0 0 0"}}>{event.title}</div>
                    <div className="Des">
                    <div className="event-time" style={{margin:"10px 0 0 0"}}>{event.start} - {event.end} ({event.period})</div>
                    <div className="event-teacher">{event.teacher}</div>
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
