/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import "../style/style/Home.css"
import Navbar from '../component/pagebar';
const Home = () => {


  return (
    <div className="home-container">
    <div className='home-tilte'>

      <Navbar />
      </div>
      <div className='home-content'>
      <div className='home-content-left'>
      <h2>
        Hệ thống quản lý trung tâm tiếng anh
      </h2>
      </div>
      <div className='home-content-right'>
      <p>
      Hệ thống Quản lý Trung tâm Tiếng Anh là một phần mềm mới được phát triển
      nhằm thay thế các quy trình thủ công và rời rạc trong việc quản lý trung 
      tâm. Trước đây, việc đăng ký khóa học, sắp xếp thời khóa biểu, theo dõi 
      tiến độ học tập, và quản lý giảng dạy chủ yếu được thực hiện thông qua giấy
      tờ, bảng tính Excel hoặc các ứng dụng riêng lẻ. Hệ thống mới cung cấp một
      nền tảng tập trung giúp tự động hóa các tác vụ quan trọng, cải thiện hiệu
      quả quản lý và trải nghiệm người dùng.
      </p>
      </div>
      </div>
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

export default Home;
