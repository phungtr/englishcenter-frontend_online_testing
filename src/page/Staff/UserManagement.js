
import React, { useState, useEffect } from "react";
import { getAllStudents, getAllTeachers,createStudent,createTeacher,updateStudent,updateTeacher } from "../../sevrice/Api";
import Navbar from "../../component/Staffnavbar";
import "../../style/style/UserManagement.css"
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", role: "STUDENT", email: "" });
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      role: "STUDENT",
      dob: "",
      phone: "",
      gender: "Unknown",
      image: "image_url",
      address: "",
      fbUrl: "",
    });
  };
  
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      role: newRole,
      ...(newRole === "STUDENT"
        ? { address: "", fbUrl: "http://facebook.com/default" }
        : { dob: "", phone: "", gender: "Unknown" }),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, teacherData] = await Promise.allSettled([
          getAllStudents(),
          getAllTeachers(),
        ]);
  
        const formattedStudents =
          studentData.status === "fulfilled"
            ? studentData.value.map((s) => ({
                id: s.svId,
                name: s.svName,
                role: "STUDENT",
                email: s.svEmail || "N/A",
                dob: s.svDob ? s.svDob.split("T")[0] : "N/A",
                gender: s.svGender || "Unknown",
                phone: s.svPhoneNumber || "N/A",
              }))
            : [];
  
        const formattedTeachers =
          teacherData.status === "fulfilled"
            ? teacherData.value.map((t) => ({
                id: t.tcId,
                name: t.tcName,
                role: "TEACHER",
                email: t.tcEmail || "N/A",
                dob: t.tcDob || "N/A",
                gender: t.tcGender || "Unknown",
                phone: t.tcPhoneNumber || "N/A",
              }))
            : [];
  
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
    setForm(user ? { ...user } : { name: "", role: "STUDENT", email: "" });
    setShowForm(true);
  };
  
const handleOk = async () => {
  if (!form.name || !form.email) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    if (editingUser) {
      const updatedUser = await updateUser(editingUser.id, form); // Cập nhật
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    } else {
      const newUser = await createUser(form); // Thêm mới
      setUsers([...users, newUser]);
    }
    setShowForm(false);
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu:", error);
  }
};
const createUser = async (userData) => {
  try {
    if (userData.role === "TEACHER") {
      const teacherData = {
        tcName: userData.name,
        aId: userData.aId || "",
        tcEmail: userData.email,
        tcDob: userData.dob || "",
        tcPhoneNumber: userData.phone || "",
        tcGender: userData.gender || "Unknown",
        tcImage: userData.image || "image_url",
        tcRole: "Teacher",
        creatorId: "admin",
        updatorId: "admin",
        tcStatus: 1,
        jsonData: "{}"
      };
      return await createTeacher(teacherData);
    } else if (userData.role === "STUDENT") {
      const studentData = {
        svName: userData.name,
        aId: userData.aId || "",
        svEmail: userData.email,
        svDob: userData.dob || "",
        svPhoneNumber: userData.phone || "",
        svGender: userData.gender || "Unknown",
        svImage: userData.image || "image_url",
        svAddress: userData.address || "N/A",
        svFbUrl: userData.fbUrl || "http://facebook.com/default",
        svRole: "Student",
        creatorId: "admin",
        updatorId: "admin",
        svStatus: 1,
        jsonData: "{}"
      };
      return await createStudent(studentData);
    } else {
      throw new Error("Vai trò không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    throw error;
  }
};


const updateUser = async (userId, userData) => {
  try {
    if (userData.role === "TEACHER") {
      return await updateTeacher(userId, userData);
    } else {
      return await updateStudent(userId, userData);
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    throw error;
  }
};


  return (
    <div className="p-6">
    <Navbar></Navbar>
    <div  className="user-management" >
      <div className="bg-white shadow-md rounded-lg p-4">
        <div style={{}}>
          <h2 className="User-title" style={{fontSize:"34px"}}>Quản lý người dùng</h2>
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

      {showForm && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
              <input placeholder="Họ và Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select value={form.role} onChange={handleRoleChange}>
                <option value="STUDENT">Sinh viên</option>
                <option value="TEACHER">Giáo viên</option>
              </select>

              {/* Nếu là sinh viên, hiển thị trường địa chỉ và Facebook */}
              {form.role === "STUDENT" && (
                <>
                  <input placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <input placeholder="Facebook URL" value={form.fbUrl} onChange={(e) => setForm({ ...form, fbUrl: e.target.value })} />
                </>
              )}

              {/* Nếu là giáo viên, hiển thị ngày sinh, số điện thoại, giới tính */}
              {form.role === "TEACHER" && (
                <>
                  <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                  <input placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Unknown">Không xác định</option>
                  </select>
                </>
              )}

              <div className="button-group">
                <button className="save-btn" onClick={handleOk}>Lưu</button>
                <button className="cancel-btn" onClick={toggleForm}>Hủy</button>
              </div>
            </div>
          </div>
        )}
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={toggleForm}>
          {showForm ? "Đóng form" : "Thêm người dùng"}
        </button>
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

export default UserManagement;