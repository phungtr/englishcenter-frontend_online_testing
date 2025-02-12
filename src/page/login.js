/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import '../style/style/login.css'; // CSS riêng cho trang

const ForgotPassword = ({ onBack }) => {
  const [resetEmail, setResetEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (resetEmail) {
      setMessage("A password reset email has been sent!");
    } else {
      setMessage("Please enter your email!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleForgotPassword}>
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit" className="login-button">Send Request</button>
        <a href="#" onClick={onBack} className="back-link">← Quay lại</a>
      </form>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    const fixedEmail = "test@example.com";
    const fixedPassword = "123456";
    
    if (email === fixedEmail && password === fixedPassword) {
      alert("Đăng nhập thành công!");
    } else {
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
