import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../style/style/Pagebar.css'; 

const StudentNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/Student-home">Trang chủ</Link></li>
        <li><Link to="/student-schedule">Thời khóa biểu</Link></li>
        <li><Link to="/student-courses">Khóa học của tôi</Link></li>
        <li><Link to="/student-grades">Điểm số</Link></li>
        <li><Link to="/student-support">Phản hồi</Link></li>
        <li>
          <button style={{ background: "#256dbb" }} onClick={handleLogout} className="logout-button">
            Đăng xuất
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default StudentNavbar;
