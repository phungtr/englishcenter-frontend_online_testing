import React, { useEffect, useState } from "react";
import { getAllAccounts, getAllStudents, getMarksBystudentId, getMyClasses } from "../../sevrice/Api";
import "../../style/style/Studentprogress.css"; // Import your CSS file
import StudentNavbar from "../../component/StudentNavbar";
const StudentProgress = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classMap, setClassMap] = useState({});

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");

        const accounts = await getAllAccounts();
        const account = accounts.find(acc => acc.aUid === username && acc.aPwd === password);
        if (!account) return alert("Không tìm thấy tài khoản!");

        const students = await getAllStudents();
        const student = students.find(sv => sv.account?.aId === account.aId);
        if (!student) return alert("Không tìm thấy sinh viên!");

        const studentMarks = await getMarksBystudentId(student.svId);
        const myClasses = await getMyClasses(student.svId);
        const classMapping = {};
        myClasses.forEach(cls => {
          classMapping[cls.classId] = cls.className;
        });
        setClassMap(classMapping);

        setStudentInfo(student);
        setMarks(studentMarks);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải tiến trình học sinh:", error);
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (!studentInfo) return <p>Không tìm thấy sinh viên</p>;

  return (
    <div className="student-progress-page">
    <StudentNavbar />
    <div className="student-progress-container">
      <div className="student-info">
        <h2>Tiến trình học tập của: <span>{studentInfo.svName}</span></h2>
        <p><strong>Email:</strong> {studentInfo.svEmail}</p>
        <p><strong>Giới tính:</strong> {studentInfo.svGender}</p>
        <p><strong>Ngày sinh:</strong> {studentInfo.svDob}</p>
      </div>

      <div className="marks-section">
        <h3>Danh sách điểm:</h3>
        {marks.length === 0 ? (
          <p>Chưa có điểm nào.</p>
        ) : (
          <table className="marks-table">
            <thead>
              <tr>
                <th>Lớp</th>
                <th>Nội dung</th>
                <th>Ngày</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {marks.map(mark => (
                <tr key={mark.markId}>
                  <td>{classMap[mark.classId] || mark.classId}</td>
                  <td>{mark.content}</td>
                  <td>{new Date(mark.markDate).toLocaleDateString()}</td>
                  <td>{mark.point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default StudentProgress;