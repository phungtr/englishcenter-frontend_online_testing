import React, { useState, useEffect } from 'react';
import '../../style/style/TeachingSchedule.css';
import Schedule from '../../component/Calender';
import { schedules } from '../../service/Api';
import TeacherNavbar from '../../component/Teachernavbar';

const TeachingSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [filters, setFilters] = useState({ teacherName: '', className: '', date: '' });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await schedules({});
        const formattedData = Array.isArray(data) ? data : [];
        setSchedule(formattedData);
        setFilteredSchedule(formattedData.filter(item => item.scheduleStatus === 1));
      } catch (error) {
        console.error('Không thể tải lịch giảng dạy:', error);
      }
    };

    fetchSchedule();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const applyFilters = (currentFilters) => {
    const filtered = schedule.filter(schedule => (
      (currentFilters.teacherName ? schedule.teacherName.toLowerCase().includes(currentFilters.teacherName.toLowerCase()) : true) &&
      (currentFilters.className ? schedule.className.toLowerCase().includes(currentFilters.className.toLowerCase()) : true) &&
      (currentFilters.date ? schedule.startTime.startsWith(currentFilters.date) : true)
    ));
    setFilteredSchedule(filtered);
  };

  return (
    <div className="teaching-schedule-container">
      <TeacherNavbar />
      <h1 className="teaching-schedule-title">Lịch Giảng Dạy</h1>
      <div className="filter-container">
        <input type="text" name="teacherName" placeholder="Lọc theo giảng viên" value={filters.teacherName} onChange={handleFilterChange} />
        <input type="text" name="className" placeholder="Lọc theo lớp học" value={filters.className} onChange={handleFilterChange} />
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
      </div>
      <Schedule schedule={filteredSchedule} />
    </div>
  );
};

export default TeachingSchedule;
