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
      { id: 4, name: "Pham Van D", role: "Staff", class: "-", status: "Đang làm việc", score: null },
      { id: 5, name: "Hoang Thi E", role: "Student", class: "11A1", status: "Đang học", score: 7.8 },
      { id: 6, name: "Nguyen Van F", role: "Teacher", class: "11A2", status: "Đang giảng dạy", score: null },
      { id: 7, name: "Tran Van G", role: "Student", class: "12A3", status: "Đang học", score: 8.2 },
      { id: 8, name: "Le Thi H", role: "Staff", class: "-", status: "Đang làm việc", score: null },
      { id: 9, name: "Pham Thi I", role: "Student", class: "10A1", status: "Đang học", score: 9.1 },
      { id: 10, name: "Bui Van J", role: "Teacher", class: "12A2", status: "Đang giảng dạy", score: null },
    ];
    setData(demoData);

  }, []);
  
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterTime, setFilterTime] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
    XLSX.writeFile(workbook, "Statistics_Report.xlsx");
  };

  const filteredData = data
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => (filterRole ? item.role === filterRole : true))
    .filter((item) => (filterCourse ? item.class === filterCourse : true))
    .sort((a, b) => {
      if (sortOrder === "asc") return a[sortKey] > b[sortKey] ? 1 : -1;
      return a[sortKey] < b[sortKey] ? 1 : -1;
    });

  const roleCounts = data.reduce((acc, item) => {
    acc[item.role] = (acc[item.role] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(roleCounts).map((role) => ({ role, count: roleCounts[role] }));

  const topStudents = data.filter((item) => item.role === "Student" && item.score !== null).sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="statistics">
      <h2>Thống kê</h2>
      <div className="filters">
        <input type="text" placeholder="Tìm kiếm theo tên..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          <option value="Student">Sinh viên</option>
          <option value="Teacher">Giáo viên</option>
          <option value="Staff">Nhân viên</option>
        </select>
        <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)}>
          <option value="">Tất cả thời gian</option>
          <option value="2024">Năm 2024</option>
          <option value="2023">Năm 2023</option>
        </select>
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="">Tất cả khóa học</option>
          <option value="10A1">10A1</option>
          <option value="10A2">10A2</option>
        </select>
        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          Sắp xếp {sortOrder === "asc" ? "↓" : "↑"}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => setSortKey("name")}>Họ và Tên</th>
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
      
      <h3 style={{ textAlign: "center" }}>Biểu đồ số lượng học sinh, giáo viên, nhân viên</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ResponsiveContainer width="50%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="role" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <h3 style={{ textAlign: "center" }}>Danh sách học sinh giỏi nhất</h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Lớp</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={exportToExcel}>Xuất Excel</button>
    </div>
  );
};

export default Statistics;
