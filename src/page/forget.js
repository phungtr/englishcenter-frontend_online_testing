/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from 'react';
import '../style/style/login.css'; 

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

export default ForgotPassword