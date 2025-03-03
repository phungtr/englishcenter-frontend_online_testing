import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../../style/style/Statistics.css";
import * as XLSX from "xlsx";

const Statistics = () => {

  const [data, setData] = useState([]);



  useEffect(() => {

    const demoData = [
      { id: 1, name: "Nguyen Van A", role: "Student", class: "10A1", status: "Đang học", score: 8.5 },
      { id: 2, name: "Tran Thi B", role: "Teacher", class: "10A2", status: "Đang giảng dạy", score: null },
      { id: 3, name: "Le Van C", role: "Student", class: "10A3", status: "Đã tốt nghiệp", score: 9.0 },
      { id: 4, name: "Pham Van D", role: "Student", class: "11A1", status: "Đang học", score: 8.5 },
      { id: 5, name: "Hoang Thi E", role: "Student", class: "11A1", status: "Đang học", score: 7.8 },
      { id: 6, name: "Nguyen Van F", role: "Teacher", class: "11A1", status: "Đang giảng dạy", score: null },
      { id: 7, name: "Tran Van G", role: "Student", class: "12A3", status: "Đang học", score: 8.2 },
      { id: 8, name: "Le Thi H", role: "Student", class: "12A2", status: "Đang học", score: 8.2 },
      { id: 9, name: "Pham Thi I", role: "Student", class: "10A1", status: "Đang học", score: 9.1 },
      { id: 10, name: "Bui Van J", role: "Teacher", class: "12A2", status: "Đang giảng dạy", score: null },
    ];
    setData(demoData);

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

  const filteredData = data
  .filter((item) => item.role !== "Staff") // Loại bỏ nhân viên
  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  .filter((item) => (filterClass ? item.class === filterClass : true))
  .filter((item) => (filterTeacher ? item.name === filterTeacher : true))
  .filter((item) => item.role !== "Teacher");





  const activeClasses = new Set();
  data.forEach((item) => {
    if (
      (item.role === "Student" && item.status === "Đang học" && item.class !== "-") ||
      (item.role === "Teacher" && item.status === "Đang giảng dạy" && item.class !== "-")
    ) {
      activeClasses.add(item.class);
    }
  });


  const totalStudents = data.filter((item) => item.role === "Student").length;
  const completedStudents = data.filter(
    (item) => item.role === "Student" && item.status === "Đã tốt nghiệp"
  ).length;
  const averageCompletionRate = totalStudents > 0
    ? ((completedStudents / totalStudents) * 100).toFixed(2)
    : 0;


    const roleCounts = data.reduce((acc, item) => {
      if (item.role !== "Staff") { // Đảm bảo Staff không xuất hiện trong biểu đồ
        acc[item.role] = (acc[item.role] || 0) + 1;
      }
      return acc;
    }, {});


    

  // Đếm số lượng lớp học
  const classCounts = { Class: new Set(data.map(item => item.class).filter(c => c && c !== "-")).size };
  const uniqueClasses = [...new Set(data.map(item => item.class).filter(c => c && c !== "-"))];
  const uniqueTeachers = [...new Set(data.filter(item => item.role === "Teacher").map(item => item.name))];
  
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
      <button onClick={exportToExcel}>Xuất Excel</button>
    </div>
  );
};

export default Statistics;
