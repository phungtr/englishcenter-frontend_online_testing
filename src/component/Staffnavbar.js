import React from 'react';
import { Link } from 'react-router-dom';
import '../style/style/Pagebar.css'; // File CSS riêng cho navbar
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert('Đăng xuất thành công!');
    localStorage.clear();
    navigate('/');
  };
  return (
    <nav className="navbar">
    <div>
     </div>
      <div>
      <ul className="nav-list">
        <li><Link to="/Staff-home">Trang chủ</Link></li>
        <li><Link to="/teaching-schedule-report">Báo cáo lịch giáo viên</Link></li>
        <li><Link to="/user-management">Quản lý người dùng</Link></li>
        <li><Link to="/statistics">Thống kê</Link></li>
        <li><Link to="/class-management">Quản lý lớp học</Link></li>
        <li><button  style={{background:" #256dbb"}} onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
      </li>
      </ul>
      </div>

    </nav>

  );
};

export default Navbar;