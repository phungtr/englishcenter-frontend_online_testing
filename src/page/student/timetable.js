import React, { useState, useEffect } from 'react';
import '../../style/style/Timetable.css';
import Schedule from '../../component/Calender';
import { schedules } from '../../service/Api';
import StudentNavbar from '../../component/StudentNavbar';

const Timetable = () => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [filters, setFilters] = useState({ className: '', date: '' });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await schedules({});
        const formattedData = Array.isArray(data) ? data : [];
        setSchedule(formattedData);
        setFilteredSchedule(formattedData.filter(item => item.scheduleStatus === 1));
      } catch (error) {
        console.error('Không thể tải thời khóa biểu học sinh:', error);
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
      (currentFilters.className ? schedule.className.toLowerCase().includes(currentFilters.className.toLowerCase()) : true) &&
      (currentFilters.date ? schedule.startTime.startsWith(currentFilters.date) : true)
    ));
    setFilteredSchedule(filtered);
  };

  return (
    <div className="timetable-container">
      <StudentNavbar />
      <h1 className="timetable-title">Thời Khóa Biểu Học Sinh</h1>
      <div className="filter-container">
        <input type="text" name="className" placeholder="Lọc theo lớp học" value={filters.className} onChange={handleFilterChange} />
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
      </div>
      <Schedule schedule={filteredSchedule} />
    </div>
  );
};

export default Timetable;
