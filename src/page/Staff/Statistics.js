import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../../style/style/Statistics.css";
import * as XLSX from "xlsx";
import { getAllClasses } from "../../sevrice/Api";
const Statistics = () => {

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getAllClasses();
        setClasses(data); // Giả sử bạn có state để lưu danh sách lớp
      } catch (error) {
        console.error("Lỗi khi tải danh sách lớp:", error);
      }
    };
  
    fetchClasses();
  }, []);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterTeacher,serFilterTeacher] = useState("");
  // Lọc theo tháng, học kỳ hoặc năm

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
    XLSX.writeFile(workbook, "Statistics_Report.xlsx");
  };

  const filteredData = classes
  .filter((item) => item.role !== "Staff") // Loại bỏ nhân viên
  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  .filter((item) => (filterClass ? item.class === filterClass : true))
  .filter((item) => (filterTeacher ? item.name === filterTeacher : true))
  .filter((item) => item.role !== "Teacher");


  const activeClasses = new Set();
  classes.forEach((item) => {
    if (
      (item.role === "STUDENT" && item.status === "Đang học" && item.class !== "-") ||
      (item.role === "TEACHER" && item.status === "Đang giảng dạy" && item.class !== "-")
    ) {
      activeClasses.add(item.class);
    }
  });

  const totalStudents = classes.filter((item) => item.role === "STUDENT").length;
  const completedStudents = classes.filter(
    (item) => item.role === "STUDENT" && item.status === "Đã tốt nghiệp"
  ).length;
  const averageCompletionRate = totalStudents > 0
    ? ((completedStudents / totalStudents) * 100).toFixed(2)
    : 0;


    const roleCounts = classes.reduce((acc, item) => {
      if (item.role !== "STAFF") { // Đảm bảo Staff không xuất hiện trong biểu đồ
        acc[item.role] = (acc[item.role] || 0) + 1;
      }
      return acc;
    }, {});


    

  // Đếm số lượng lớp học
  const classCounts = { Class: new Set(classes.map(item => item.class).filter(c => c && c !== "-")).size };
  const uniqueClasses = [...new Set(classes.map(item => item.class).filter(c => c && c !== "-"))];
  const uniqueTeachers = [...new Set(classes.filter(item => item.role === "Teacher").map(item => item.name))];
  
  const chartData = [
    ...Object.keys(roleCounts).map(role => ({ category: role, count: roleCounts[role] })),
    { category: "Class", count: classCounts["Class"] || 0 }
  ];
  console.log("Số lượng lớp thực tế:", classCounts["Class"]);
  return (
    <div className="statistics">
      <h2>Thống kê</h2>

      {/* Bảng thống kê nhanh các chỉ số */}
      <div className="quick-stats">
        <p>Tỷ lệ hoàn thành khoá học trung bình: <b>{averageCompletionRate}%</b></p>
      </div>

      {/* Khu vực lọc */}
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterTeacher} onChange={(e) => serFilterTeacher(e.target.value)}>
          <option value="">Tất cả giáo viên</option>
          {uniqueTeachers.map((teacher) => (
            <option key={teacher} value={teacher}>{teacher}</option>
          ))}
        </select>

        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">Tất cả lớp</option>
          {uniqueClasses.map((className) => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>

      </div>

      {/* Bảng danh sách (không áp dụng sắp xếp theo yêu cầu) */}
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
              <td>{item.score ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Biểu đồ số lượng (theo vai trò) */}
      <h3 style={{ textAlign: "center" }}>Biểu đồ số lượng (Học sinh, Giáo viên, Lớp)</h3>
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

      {/* Nút xuất Excel */}
      <button  className="export"onClick={exportToExcel}>Xuất Excel</button>
    </div>
  );
};

export default Statistics;
