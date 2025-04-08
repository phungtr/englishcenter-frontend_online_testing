/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";
import "../style/style/Calender.css";

const colors = ["#ffdddd", "#ddeeff", "#ddffdd", "#ffeeaa", "#e5ddff", "#f9f9f9"];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Schedule = ({ schedule }) => {

  const colorMapRef = useRef({}); // Giữ nguyên map qua các lần render

  useEffect(() => {
    schedule.forEach((item) => {
      const key = item.className;
      if (!colorMapRef.current[key]) {
        colorMapRef.current[key] = getRandomColor();
      }
    });
  }, [schedule]);


  const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
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
    const vietnamDate = new Date(localDate.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const dayOfWeek = vietnamDate.getDay();
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
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
              const startTimeValue = extractTime(schedule?.startTime);
              const endTimeValue = extractTime(schedule?.endTime);
              const top = timeToPosition(startTimeValue);
              const height = timeToPosition(endTimeValue) - top;
              const dayIndex = getDayIndex(schedule?.startTime);
              const eventClass = `event ${schedule.className.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <div
                  key={index}
                  className={eventClass}
                  style={{
                    backgroundColor: colorMapRef.current[schedule.className],
                    gridColumnStart: dayIndex + 2,
                    top: `${top}px`,
                    height: `${height}px`,
                    position: "absolute",
                    left: `${dayIndex * 188.5}px`,
                    width: "188.5px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div className="event-content">
                    <div className="event-title" style={{ fontSize: "16px", fontWeight: "bold", textAlign: "center", margin: "20px 0 0 0" }}>{schedule.className}</div>
                    <div className="Des">
                      <div className="event-time" style={{ margin: "10px 0 0 0" }}>{startTimeValue} - {endTimeValue}</div>
                      <div className="event-teacher">{schedule.teacherName}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;