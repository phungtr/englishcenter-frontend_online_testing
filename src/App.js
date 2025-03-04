import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './page/login';
import Home from './page/Home';
import TeachingScheduleReport from './page/teacher/Teachingrepost';
import UserManagement from './page/Staff/UserManagement';
import Statistics from './page/Staff/Statistics';
// import ReportStatistics from './page/Dasboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/teaching-schedule-report" element={<TeachingScheduleReport />} />
        <Route path='/user-management' element={<UserManagement/>}/>
        <Route path='/statistics' element={<Statistics/>}/>
        {/* <Route path='/Dasboard' element= {<ReportStatistics/>}/> */}
      </Routes>
    </Router>
  );
}

export default App;