import React, { useState, useEffect } from "react";
import { getAllClasses, getAllStudentsInClass, addStudentToClass, getAllStudents, getAllTeachers, findClasses, updateStudent } from "../../sevrice/Api";
import * as XLSX from "xlsx";
import "../../style/style/ClassManagement.css";
import Navbar from '../../component/Staffnavbar'

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [newStudent, setNewStudent] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [updatedStudentData, setUpdatedStudentData] = useState({});
  const [newTeacher, setNewTeacher] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classData, studentData, teacherData] = await Promise.all([
        getAllClasses(),
        getAllStudents(),
        getAllTeachers()
      ]);
      setClasses(classData);
      setAllStudents(studentData);
      setAllTeachers(teacherData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  const handleClassSelect = async (classId) => {
    try {
      setSelectedClass(classId);
      const classInfo = await findClasses(classId);
      setSelectedClassName(classInfo ? classInfo.className : "");
      setSelectedTeacher(classInfo?.teacher?.tcName || "Chưa có giáo viên");
      const data = await getAllStudentsInClass(classId);
      setStudents(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách học viên:", error);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedClass || !newStudent) return;
    try {
      await addStudentToClass({ classId: selectedClass, studentId: newStudent });
      const studentInfo = allStudents.find(st => st.svId === newStudent);
      setNewStudentName(studentInfo ? studentInfo.svName : "");
      handleClassSelect(selectedClass);
      setNewStudent("");
    } catch (error) {
      console.error("Lỗi khi thêm học viên:", error);
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    try {
      await updateStudent(editingStudent.svId, updatedStudentData);
      handleClassSelect(selectedClass);
      setEditingStudent(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật học viên:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedClassName || "Danh sách học viên");
    XLSX.writeFile(workbook, `Danh_sach_${selectedClassName}.xlsx`);
  };

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchClass.toLowerCase()) &&
    (activeStatus ? cls.classStatus.toString() === activeStatus : true)
  );

  return (
    <div className="class-control">
      <Navbar />
      <div className="class-management">
      <div className="class-management-control">
        <h2 style={{frontSize:"30px"}}>Quản lý Lớp Học</h2>
        <div className="contronl-firt">
        <input type="text" placeholder="Tìm kiếm lớp..." value={searchClass} onChange={(e) => setSearchClass(e.target.value)} />
        <select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Không hoạt động</option>
        </select>
        </div>

        <div className="class-list">
          <h3>Danh sách lớp</h3>
          <ul>
            {filteredClasses.map((cls) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li key={cls.classId} onClick={() => handleClassSelect(cls.classId)}>
                {cls.className} ({cls.classStatus === 1 ? "Hoạt động" : "Không hoạt động"})
              </li>
            ))}
          </ul>
        </div>

        {selectedClass && (
          <div className="class-details">
            <h3>Chi tiết lớp - {selectedClassName}</h3>
            <p>Giáo viên: {selectedTeacher}</p>
            <p>Học viên mới thêm: {newStudentName || "Chưa có"}</p>
            <h3>Chọn giáo viên mới</h3>
            <select value={newTeacher} onChange={(e) => setNewTeacher(e.target.value)}>
              <option value="">Chọn giáo viên</option>
              {allTeachers.map((teacher) => (
                <option key={teacher.tcId} value={teacher.tcName}>{teacher.tcName}</option>
              ))}
            </select>
            <h3>Danh sách học viên</h3>
            <ul>
              {students.map((student) => (
                <li key={student.svId}>
                  {student.svName}
                  <button onClick={() => setEditingStudent(student)}>Sửa</button>
                </li>
              ))}
            </ul>
            {editingStudent && (
              <div>
                <h3>Chỉnh sửa thông tin học viên</h3>
                <input type="text" placeholder="Tên" value={updatedStudentData.svName || editingStudent.svName} onChange={(e) => setUpdatedStudentData({ ...updatedStudentData, svName: e.target.value })} />
                <input type="email" placeholder="Email" value={updatedStudentData.svEmail || editingStudent.svEmail} onChange={(e) => setUpdatedStudentData({ ...updatedStudentData, svEmail: e.target.value })} />
                <button onClick={handleUpdateStudent}>Cập nhật</button>
              </div>
            )}
            <button onClick={handleAddStudent}>Thêm học viên</button>
            <button onClick={exportToExcel}>Xuất danh sách học viên</button>
          </div>
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
          <p>&copy; Bản quyền thuộc về Phùng Quang Trà | Cung cấp bởi Nhóm 1</p>
        </div>
      </footer>
    </div>
  );
};

export default ClassManagement;
