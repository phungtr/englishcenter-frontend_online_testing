/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import '../style/style/login.css';
import ForgotPassword from './forget';
import { useNavigate } from 'react-router-dom';
import { login } from '../sevrice/Api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (!data.token || !data.role) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ!");
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      alert(`Đăng nhập thành công! Vai trò: ${data.role}`);

      if (data.role === 'ADMIN') navigate('/Admin-home');
      else if (data.role === 'STAFF') navigate('/Staff-home');
      else if (data.role === 'TEACHER') navigate('/Teacher-home');
      else if (data.role === 'STUDENT') navigate('/Student-home');
      else throw new Error("Vai trò không hợp lệ!");

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };

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
              <label htmlFor="username">Email:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
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
