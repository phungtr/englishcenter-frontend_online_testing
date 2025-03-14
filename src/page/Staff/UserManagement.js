import React, { useState, useEffect } from "react";
import { getAllStudents, getAllTeachers } from "../../sevrice/Api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", role: "STUDENT", email: "" });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, teacherData] = await Promise.all([
          getAllStudents(),
          getAllTeachers(),
        ]);
  
        const formattedStudents = studentData.map((s) => ({
          id: s.svId, name: s.svName, role: "STUDENT", email: s.svEmail,
        }));
  
        const formattedTeachers = teacherData.map((t) => ({
          id: t.tcId, name: t.tcName, role: "TEACHER", email: t.tcEmail,
        }));
  
        const mergedUsers = [...formattedStudents, ...formattedTeachers];
        setUsers(mergedUsers);
        console.log("Merged Users:", mergedUsers);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);
  
  const showModal = (user = null) => {
    setEditingUser(user);
    setForm(user ? { ...user } : { name: "", role: "Student", email: "" });
    setIsModalOpen(true);
  };
  
  const handleOk = () => {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Email không hợp lệ");
      return;
    }
  
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...form, id: u.id } : u)));
    } else {
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { ...form, id: newId }]);
    }
  
    setIsModalOpen(false);
  };
//   const handleOk = async () => {
//   if (!form.name || !form.email) {
//     alert("Vui lòng nhập đầy đủ thông tin");
//     return;
//   }

//   try {
//     if (editingUser) {
//       const updatedUser = await updateUser(editingUser.id, form); // Cập nhật
//       setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
//     } else {
//       const newUser = await createUser(form); // Thêm mới
//       setUsers([...users, newUser]);
//     }
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error("Lỗi khi lưu dữ liệu:", error);
//   }
// };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Quản lý người dùng</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => showModal()}>Thêm người dùng</button>
        </div>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Họ và Tên</th>
              <th className="border p-2">Vai trò</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => showModal(user)}>
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold">{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
            <input className="w-full p-2 border rounded my-2" placeholder="Họ và Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full p-2 border rounded my-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className="w-full p-2 border rounded my-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Student">Sinh viên</option>
              <option value="Teacher">Giáo viên</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleOk}>Lưu</button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
