import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const ReportStatistics = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const data = [
    { name: 'Lớp A', hocVien: 30, hoanThanh: 25 },
    { name: 'Lớp B', hocVien: 25, hoanThanh: 20 },
    { name: 'Lớp C', hocVien: 40, hoanThanh: 35 },
  ];

  const pieData = [
    { name: 'Hoàn thành', value: 80 },
    { name: 'Chưa hoàn thành', value: 20 },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  const handleFilter = () => {
    console.log('Lọc dữ liệu với:', { selectedClass, selectedTeacher, dateRange });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Bộ lọc thống kê */}
      <div className="p-4 border rounded-lg shadow space-y-4 bg-white">
        <h2 className="text-xl font-bold">Bộ lọc thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="p-2 border rounded"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Chọn lớp học</option>
            <option value="Lớp A">Lớp A</option>
            <option value="Lớp B">Lớp B</option>
            <option value="Lớp C">Lớp C</option>
          </select>
          <select
            className="p-2 border rounded"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Chọn giảng viên</option>
            <option value="Giảng viên A">Giảng viên A</option>
            <option value="Giảng viên B">Giảng viên B</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleFilter}
        >
          Lọc dữ liệu
        </button>
      </div>

      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Tổng số lớp: 10', 'Số học viên: 200', 'Số giảng viên: 15', 'Tỷ lệ hoàn thành: 85%'].map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow bg-white text-center">
            <p className="text-lg font-semibold">{item.split(':')[0]}</p>
            <p className="text-2xl font-bold">{item.split(':')[1]}</p>
          </div>
        ))}
      </div>

      {/* Biểu đồ thống kê */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <h2 className="text-xl font-bold mb-4">Biểu đồ thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarChart width={400} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hocVien" fill="#8884d8" name="Học viên" />
            <Bar dataKey="hoanThanh" fill="#82ca9d" name="Hoàn thành" />
          </BarChart>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Xuất báo cáo */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Xuất Excel</button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Xuất PDF</button>
      </div>
    </div>
  );
};

export default ReportStatistics;
