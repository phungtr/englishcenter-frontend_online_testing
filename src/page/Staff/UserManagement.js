import React, { useState } from "react";
import "../../style/style/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyen Van A", role: "Student", email: "a@example.com" },
    { id: 2, name: "Tran Thi B", role: "Teacher", email: "b@example.com" },
  
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", role: "Student", email: "" });

  const showModal = (user = null) => {
    setEditingUser(user);
    setForm(user || { name: "", role: "Student", email: "" });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (!form.name || !form.email) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...form, id: u.id } : u)));
    } else {
      setUsers([...users, { ...form, id: users.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="user-management">
      <div className="user-tilte"><h2>Quản lý người dùng</h2></div>
      <button className="add-button" onClick={() => showModal()}>Thêm người dùng</button>
      <table>
        <thead>
          <tr>
            <th>Họ và Tên</th>
            <th>Vai trò</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>

              <td >
                <button style={{background:"#28a745"}} onClick={() => showModal(user)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h3>
            <input
              type="text"
              placeholder="Họ và Tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="Student">Sinh viên</option>
              <option value="Teacher">Giáo viên</option>

            </select>
            <div className="User-management-button" style={{display:"flex"}}>
            <button onClick={handleOk}>Lưu</button>
            <button onClick={() => setIsModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
