import React from 'react';
import {Route, Routes } from 'react-router-dom';
import { BrowserRouter} from "react-router-dom";  
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
import StudentClassPage from './page/teacher/teacherscore';
import TeachingContentPage from './page/teacher/teachercontent';
import StudentTeachingPage from './page/student/Studentcontent';
import StudentProgress from './page/student/Studentprogress';
// import ReportStatistics from './page/Dasboard';
function App() {

  return (
    <BrowserRouter>
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
        <Route path='/teacher-students' element={<StudentClassPage/>}/>
        <Route path='/teacher-respo' element={<TeachingContentPage/>}/>
        <Route path='/student-courses' element={<StudentTeachingPage />}/>
        <Route path='/student-grades' element={<StudentProgress/>}/>
      </Routes>
    </BrowserRouter> 
  );
}

export default App;

