import React from 'react';
import "../../style/style/Home.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import TeacherNavbar from '../../component/Teachernavbar';

const TeacherHome = () => {
  const data = [
    { name: 'Lớp A', họcViên: 30, hoànThành: 25 },
    { name: 'Lớp B', họcViên: 25, hoànThành: 20 },
    { name: 'Lớp C', họcViên: 40, hoànThành: 35 },
  ];

  const pieData = [
    { name: 'Đã dạy', value: 70 },
    { name: 'Chưa dạy', value: 30 },
  ];

  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <div className="home-container">
    <TeacherNavbar/>
      <div className="home-title" style={{display:"flex",justifyContent:"center",flexWrap:"wrap"}}>

   
      <div className="home-content">
        <div className="home-content-left">
          <h2>Trang chủ Giáo viên</h2>
        </div>
        <div className="home-content-right">
          <p>Hệ thống giúp giáo viên quản lý lịch dạy, theo dõi tiến độ học viên và cập nhật báo cáo giảng dạy.</p>
        </div>
      </div>

      <div style={{ background: "#fff", opacity: "0.95", display: "flex", borderRadius: "20px" }}>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="text-xl font-bold mb-4" style={{ paddingBottom: "40px", fontSize: "40px" }}>Thống kê giảng dạy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: "flex", width: "1100px", justifyContent: "space-around" }}>
            <BarChart width={400} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="họcViên" fill="#8884d8" name="Học viên" />
              <Bar dataKey="hoànThành" fill="#82ca9d" name="Hoàn thành" />
            </BarChart>
            <PieChart width={300} height={300}>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
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
        <p>&copy; Bản quyền thuộc về Phùng Quang Trà | Cung cấp bởi Nhóm 1</p>
      </div>
    </footer>
    </div>
  );
};

export default TeacherHome;
