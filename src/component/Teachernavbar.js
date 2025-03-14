import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../style/style/Pagebar.css'; 

const TeacherNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/Teacher-home">Trang chủ</Link></li>
        <li><Link to="/teacher-schedule">Lịch dạy</Link></li>
        <li><Link to="/teacher-students">Danh sách học viên</Link></li>
        <li><Link to="/teacher-reports">Báo cáo giảng dạy</Link></li>
        <li><Link to="/teacher-support">Hỗ trợ</Link></li>
        <li>
          <button style={{ background: "#256dbb" }} onClick={handleLogout} className="logout-button">
            Đăng xuất
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TeacherNavbar;
