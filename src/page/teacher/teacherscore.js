// StudentClassPage.jsx
import React, { useEffect, useState } from 'react';
import {
  getAllAccounts,
  getAllTeachers,
  getAllClasses,
  getAllStudentsInClass,
  getMarksByClassId,
  updateMark
} from '../../sevrice/Api';
import '../../style/style/teacherscore.css';
import TeacherNavbar from '../../component/Teachernavbar';

const StudentClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editedMarks, setEditedMarks] = useState({});
  const [originalMarks, setOriginalMarks] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        const accounts = await getAllAccounts();
        const account = accounts.find(acc => acc.aUid === username && acc.aPwd === password);
        if (!account) return;

        const teachers = await getAllTeachers();
        const teacher = teachers.find(tc => tc.aId === account.aId);
        if (!teacher) return;

        const allClasses = await getAllClasses();
        const filtered = allClasses.filter(cls => cls.teacher?.tcId === teacher.tcId);
        setClasses(filtered);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    loadData();
  }, []);

  const loadStudentsAndMarks = async (classId) => {
    try {
      const studentList = await getAllStudentsInClass(classId);
      const markList = await getMarksByClassId(classId);
      setStudents(studentList);
      setMarks(markList);
      setSelectedClass(classId);
      setCurrentIndex(0);
      setEditedMarks({});
      setOriginalMarks({});
    } catch (error) {
      console.error('Lỗi khi tải học sinh và điểm:', error);
    }
  };

  const currentStudent = students[currentIndex];
  const getStudentMark = (svId) => marks.find(mark => mark.studentId === svId);

  const handleEdit = (studentId, value) => {
    setEditedMarks(prev => ({ ...prev, [studentId]: value }));
    if (!originalMarks[studentId]) {
      const original = getStudentMark(studentId)?.point || '';
      setOriginalMarks(prev => ({ ...prev, [studentId]: original }));
    }
  };

  const handleCancel = (studentId) => {
    setEditedMarks(prev => {
      const updated = { ...prev };
      delete updated[studentId];
      return updated;
    });
    setOriginalMarks(prev => {
      const updated = { ...prev };
      delete updated[studentId];
      return updated;
    });
  };
  
  const handleConfirm = async (studentId) => {
    const mark = getStudentMark(studentId);
    if (!mark) return;
  
    const newPoint = editedMarks[studentId];
    const updatedMark = {
      ...mark,
      point: Number(newPoint),
      updatedDate: new Date().toISOString()
    };
  
    await updateMark(mark.markId, updatedMark);
  
    const updatedMarks = marks.map(m => m.markId === mark.markId ? updatedMark : m);
    setMarks(updatedMarks);
    handleCancel(studentId); 
  };

  return (
    <div className='TeacherClassPage'>
      <TeacherNavbar />
      <div style={{ padding: '20px', backgroundColor: '#fff', margin: '1%', height: '600px' }}>
        <h2>Danh sách lớp bạn đang dạy</h2>
        {classes.map(cls => (
          <button
            key={cls.classId}
            onClick={() => loadStudentsAndMarks(cls.classId)}
            style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 10px', cursor: 'pointer' }}
          >
            {cls.className}
          </button>
        ))}

        {currentStudent && (
          <div style={{ marginTop: '20px', border: '1px solid black', padding: '20px' }}>
            <h3>Thông tin học sinh - Lớp {classes.find(cls => cls.classId === selectedClass)?.className}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={cellStyle}>Họ tên</td><td style={cellStyle}>{currentStudent.svName}</td></tr>
                <tr><td style={cellStyle}>Giới tính</td><td style={cellStyle}>{currentStudent.svGender}</td></tr>
                <tr><td style={cellStyle}>Ngày sinh</td><td style={cellStyle}>{currentStudent.svDob}</td></tr>
                <tr><td style={cellStyle}>Email</td><td style={cellStyle}>{currentStudent.svEmail}</td></tr>
                <tr>
                  <td style={cellStyle}>Điểm</td>
                  <td style={cellStyle}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.1"
                      value={editedMarks[currentStudent.svId] ?? getStudentMark(currentStudent.svId)?.point ?? ''}
                      onChange={(e) => handleEdit(currentStudent.svId, e.target.value)}
                      style={{ width: '80px' }}
                    />
                    {editedMarks[currentStudent.svId] !== undefined &&
                      editedMarks[currentStudent.svId] !== originalMarks[currentStudent.svId] && (
                        <>
                          <span style={{ marginLeft: '10px' }}>{getStudentMark(currentStudent.svId)?.point}/100</span>
                          <button
                            style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleConfirm(currentStudent.svId);
                            }}
                          >
                            Xác nhận
                          </button>
                          <button
                            style={{ marginLeft: '5px', backgroundColor: 'red', color: 'white' }}
                            onClick={() => handleCancel(currentStudent.svId)}
                          >
                            Hủy
                          </button>
                        </>
                      )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '20px' }}>
              <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}>← Trước</button>
              <span style={{ margin: '0 10px' }}>
                Học sinh {currentIndex + 1}/{students.length}
              </span>
              <button disabled={currentIndex === students.length - 1} onClick={() => setCurrentIndex(i => i + 1)}>Sau →</button>
            </div>
          </div>
        )}
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
          <p>© Bản quyền thuộc về Phùng Quang Trà - Cung cấp bởi Nhóm 1</p>
        </div>
      </footer>
    </div>
  );
};

const cellStyle = {
  border: '1px solid black',
  padding: '8px',
  textAlign: 'left'
};

export default StudentClassPage;