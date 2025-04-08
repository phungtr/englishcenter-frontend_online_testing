/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from 'react';
import {
  getAllAccounts,
  getAllTeachers,
  getAllClasses,
  getTeachingContentByClassId,
  createTeachingContentWithUpload
} from '../../sevrice/Api'; // chỉnh lại đường dẫn nếu cần
import '../../style/style/TeachingContentPage.css'; // CSS riêng
import TeacherNavbar from '../../component/Teachernavbar'; // chỉnh lại đường dẫn nếu cần
const TeachingContentPage = () => {
  const [teacherId, setTeacherId] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [contents, setContents] = useState([]);
  const [formData, setFormData] = useState({
    classId: '',
    lessonId: '',
    title: '',
    content: '',
    file: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        const accounts = await getAllAccounts();
        const account = accounts.find(acc => acc.username === username);
        const aUid = account?.aId;

        const teachers = await getAllTeachers();
        const teacher = teachers.find(t => t.accountId === aUid);
        const teacherId = teacher?.tcId; 
        setTeacherId(teacherId);

        const classes = await getAllClasses();
        setClasses(classes);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
      }
    };

    fetchData();
  }, []);

  const handleClassSelect = async (classId) => {
    setSelectedClassId(classId);
    const data = await getTeachingContentByClassId(classId);
    const filtered = data.filter(item => item.teacherId === teacherId);
    setContents(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeachingContentWithUpload({
        ...formData,
        teacherId
      });
      alert('Tạo bài giảng thành công!');
      handleClassSelect(formData.classId); // refresh list
    } catch (error) {
      alert('Tạo thất bại!');
    }
  };

  return (
    <div className="teaching-content-page">
    <TeacherNavbar/>.
    <div className="teaching-content-middermidder">
    <div className="teaching-container">
      <h2 className="heading">Quản lý bài giảng</h2>

      <div className="section">
        <label>Chọn lớp:</label>
        <select onChange={(e) => handleClassSelect(e.target.value)}>
          <option value="">-- Chọn lớp --</option>
          {classes.map(cls => (
            <option key={cls.classId} value={cls.classId}>
              {cls.className}
            </option>
          ))}
        </select>
      </div>

      <div className="section">
        <h3>Danh sách tài liệu:</h3>
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

      <div className="section">
        <h3>cập nhập tài liệu mới:</h3>
        <form onSubmit={handleSubmit} className="form">
        <select name="classId" onChange={handleInputChange} required value={formData.classId || selectedClassId}>
            <option value="">-- Chọn lớp --</option>
            {classes.map(cls => (
              <option key={cls.classId} value={cls.classId}>
                {cls.className}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="lessonId"
            placeholder="Mã bài học"
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Nội dung bài giảng"
            onChange={handleInputChange}
            required
          />
          <input type="file" onChange={handleFileChange} required />
          <button type="submit">Tạo bài giảng</button>
        </form>
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

export default TeachingContentPage;
