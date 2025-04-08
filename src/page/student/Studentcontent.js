import React, { useEffect, useState } from 'react';
import {
  getAllAccounts,
  getAllStudents,
  getMarksBystudentId,
  getTeachingContentByClassId
} from '../../sevrice/Api';
import '../../style/style/TeachingContentPage.css';
import StudentNavbar from '../../component/StudentNavbar';

const StudentTeachingPage = () => {
  const [contents, setContents] = useState([]);
  const [className, setClassName] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const username = localStorage.getItem('username');
        const accounts = await getAllAccounts();
        const account = accounts.find(acc => acc.username === username);
        const aId = account?.aId;

        const students = await getAllStudents();
        const student = students.find(s => s.accountId === aId);
        const studentId = student?.studentId;

        const marks = await getMarksBystudentId(studentId);
        const classId = marks[0]?.classId; // giả sử có ít nhất 1 bản ghi

        const teachingContents = await getTeachingContentByClassId(classId);
        setContents(teachingContents);
        setClassName(student?.className || `Lớp ${classId}`);
      } catch (error) {
        console.error('Lỗi khi tải nội dung học sinh:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="teaching-content-page">
      <StudentNavbar />
      <div className="teaching-content-middermidder">
    <div className="teaching-container" style={{ height:'600px' }}>
      <h2 className="heading">Bài giảng dành cho học sinh</h2>
      <p>Lớp của bạn: {className}</p>

      <div className="section">
        {contents.map(content => (
          <div key={content.id} className="card">
            <p><strong>Tiêu đề:</strong> {content.title}</p>
            <p><strong>Nội dung:</strong> {content.content}</p>
            <a
              href={`/${content.filepath.replace(/\\/g, '/')}`}
              target="_blank"
              rel="noreferrer"
            >
              Xem file
            </a>
          </div>
        ))}
      </div>
    </div>
    </div>
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
          <p>© Bản quyền thuộc về Phùng Quang Trà
            Cung cấp bởi Nhóm 1</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentTeachingPage;
