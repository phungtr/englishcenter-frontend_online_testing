import React from 'react';
import {Route, Routes } from 'react-router-dom';
import LoginPage from './page/login';
import TeachingScheduleReport from './page/Staff/Teachingrepost';
import UserManagement from './page/Staff/UserManagement';
import Statistics from './page/Staff/Statistics';
import StaffHome from './page/Dasboards/Staffhome';
import TeacherHome from './page/Dasboards/Teacherhome';
import StudentHome from './page/Dasboards/Studenthome';
import TeachingSchedule from './page/teacher/teachingschedule'
import TimeTable from './page/student/timetable';
import ClassManagement from './page/Staff/ClassManagement'
// import ReportStatistics from './page/Dasboard';
function App() {

  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Staff-home" element={<StaffHome/>} />
        <Route path="/Teacher-home" element={<TeacherHome />} />
        <Route path="/Student-home" element={<StudentHome/>} />
        <Route path="/teaching-schedule-report" element={<TeachingScheduleReport />} />
        <Route path='/user-management' element={<UserManagement/>}/>
        <Route path='/statistics' element={<Statistics/>}/>
        <Route path='/teacher-schedule' element={<TeachingSchedule/>}/>
        <Route path='/student-schedule' element={<TimeTable/>}/>
        <Route path='/class-management' element= {<ClassManagement/>}/>
      </Routes>
  );
}

export default App;