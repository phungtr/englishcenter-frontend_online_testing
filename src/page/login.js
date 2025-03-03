/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState,useEffect} from 'react';
import '../style/style/login.css'; // CSS riêng cho trang
import ForgotPassword from './forget';
import { useNavigate } from 'react-router-dom';
import { getLoginPage } from '../sevrice/Api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [userdetails, setUserdetails] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate(); // Khai báo useNavigate()
  const handleLogin = (e) => {
    e.preventDefault();
    
    const fixedEmail = "test@example.com";
    const fixedPassword = "123456";
    
    if (userdetails?.email === fixedEmail && userdetails?.password === fixedPassword) {
      alert("Đăng nhập thành công!");
      navigate('/home')
    } else {
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLoginPage();
        setUserdetails(data);
        console.log("đăng nhập",data)
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <div className="login-page">
      {showForgotPassword ? (
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      ) : (
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
            <a 
            href="#" 
            className="forgot-password-link" 
            onClick={() => setShowForgotPassword(true)}
            style={{ display: 'block', marginTop: '10px', textAlign: 'left' }}
          >
            Quên mật khẩu
          </a>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-container">
      <div className="footer-section">
        <h3>Quản lý trung tâm tiếng Anh</h3>
        <p>Hệ thống quản lý hiện đại và tiện lợi</p>
      </div>
      <div className="footer-section">
        <h4>Bạn cần hỗ trợ</h4>
        <p>0867 460 906</p>
        <p>Địa chỉ: Hà Đông, Hà Nội, Việt Nam</p>
        <p>Email: phungtra@gmail.com</p>
      </div>
      <div className="footer-section">
        <h4>Hỗ trợ khách hàng</h4>
        <ul>
          <li><a href="/">Trang chủ</a></li>
          <li><a href="/about">Giới thiệu</a></li>
          <li><a href="/categories">Danh mục</a></li>
          <li><a href="/news">Tin tức</a></li>
          <li><a href="/help">Hướng dẫn sử dụng</a></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>&copy; Bản quyền thuộc về Phùng Quang Trà | Cung cấp bởi Nhóm 1</p>
      </div>
    </footer>
    </div>
  );
};

export default LoginPage;