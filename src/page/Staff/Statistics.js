import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../../style/style/Statistics.css";
import * as XLSX from "xlsx";
import { getAllClasses, getAllStudentsInClass } from "../../sevrice/Api";
import Navbar from "../../component/Staffnavbar";

const Statistics = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await getAllClasses();
        setClasses(classData);

        let allStudents = [];
        for (const classItem of classData) {
          const studentData = await getAllStudentsInClass(classItem.classId);
          allStudents = [...allStudents, ...studentData.map(student => ({
            id: student.svId,
            name: student.svName,
            role: "Student",
            class: classItem.className,
            status: student.svStatus === 1 ? "Đang học" : "Đã tốt nghiệp",
            score: "-",
          }))];
        }
        setStudents(allStudents);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
    XLSX.writeFile(workbook, "Statistics_Report.xlsx");
  };

  const filteredData = [...classes.map(c => ({
    id: c.classId,
    name: c.teacher?.tcName || "N/A",
    role: "Teacher",
    class: c.className,
    status: c.classStatus === 1 ? "Đang giảng dạy" : "Ngừng hoạt động",
    score: "-",
  })), ...students]
  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  .filter((item) => (filterClass ? item.class === filterClass : true))
  .filter((item) => (filterTeacher ? item.name === filterTeacher : true));

  const roleCounts = { Teacher: classes.length, Student: students.length };
  const uniqueClasses = [...new Set(classes.map(c => c.className))];
  const uniqueTeachers = [...new Set(classes.map(c => c.teacher?.tcName).filter(Boolean))];

  const chartData = Object.keys(roleCounts).map(role => ({ category: role, count: roleCounts[role] }));

  return (
    <div className="statistics">
      <Navbar />
      <div className="statistics-container">
        <h2>Thống kê</h2>

        <div className="filters">
          <input type="text" placeholder="Tìm kiếm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
            <option value="">Tất cả giáo viên</option>
            {uniqueTeachers.map((teacher) => <option key={teacher} value={teacher}>{teacher}</option>)}
          </select>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Tất cả lớp</option>
            {uniqueClasses.map((className) => <option key={className} value={className}>{className}</option>)}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Vai trò</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>{item.class}</td>
                <td>{item.status}</td>
                <td>{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ textAlign: "center" }}>Biểu đồ số lượng (Học sinh, Giáo viên)</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ResponsiveContainer width="50%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button className="export" onClick={exportToExcel}>Xuất Excel</button>
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

export default Statistics;
