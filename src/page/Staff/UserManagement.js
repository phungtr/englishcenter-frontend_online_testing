
import React, { useState, useEffect } from "react";
import { getAllStudents, getAllTeachers, createStudent, createTeacher, updateStudent, updateTeacher, getAllAccounts, createAccount } from "../../sevrice/Api";
import Navbar from "../../component/Staffnavbar";
import "../../style/style/UserManagement.css"
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [suggestedNames, setSuggestedNames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  const sortedUsers = [...users].sort((a, b) => (a.role === "TEACHER" ? -1 : 1));
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [formData, setFormData] = useState({
    aUid: "",
    aPwd: "",
    aType: 1,
    aStatus: 1,
    jsonData: "{}"
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "STUDENT",
    dob: "",
    phoneNumber: "",
    gender: "Male",
    address: "",  // Chỉ dành cho STUDENT
    fbUrl: "http://facebook.com/default",  // Chỉ dành cho STUDENT
  });
  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      role: "STUDENT",
      dob: "",
      phoneNumber: "",
      gender: "Male",
      address: "",  // Chỉ dành cho STUDENT
      fbUrl: "http://facebook.com/default",  // Chỉ dành cho STUDENT
    });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      role: newRole,
      ...(newRole === "STUDENT"
        ? { address: "", fbUrl: "http://facebook.com/default" }
        : { address: undefined, fbUrl: undefined }),
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "aType" ? parseInt(value) : value, // Chuyển `aType` thành số
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
              dob: s.svDob ? s.svDob.split("T")[0] : "N/A", // Chuẩn hóa định dạng ngày
              gender: s.svGender || "Unknown",
              phoneNumber: s.svPhoneNumber || "N/A",
              address: s.svAddress || "N/A",// Đổi phone -> phoneNumber
              fbUrl: s.svFbUrl || "http://facebook.com/default",
            }))
            : [];

        const formattedTeachers =
          teacherData.status === "fulfilled"
            ? teacherData.value.map((t) => ({
              id: t.tcId,
              name: t.tcName,
              role: "TEACHER",
              email: t.tcEmail || "N/A",
              dob: t.tcDob ? t.tcDob.split("T")[0] : "N/A", // Chuẩn hóa định dạng ngày
              gender: t.tcGender || "Unknown",
              phoneNumber: t.tcPhoneNumber || "N/A", // Đổi phone -> phoneNumber
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
  const showModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      dob: user.dob || "",
      phoneNumber: user.phoneNumber || "", // Đảm bảo dùng phoneNumber
      gender: user.gender || "Male",
      role: user.role, // Giữ cố định, không cho sửa
      address: user.address || "",
      fbUrl: user.fbUrl || "",
    });
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAccount = await createAccount(formData);
      alert("Tài khoản đã được tạo thành công!");
      console.log("Tài khoản mới:", newAccount);
      setFormData({
        aUid: "",
        aPwd: "",
        aType: 1,
        aStatus: 1,
        jsonData: "{}"
      });
    } catch (error) {
      alert("Lỗi khi tạo tài khoản!");
    }
  };
  useEffect(() => {
    if (form.name.trim() !== "") {
      getAvailableAccount(form.role, form.name);
    } else {
      setSuggestedNames([]);
    }
  }, [form.name, form.role]);
  const getAvailableAccount = async (role, name) => {
    try {
      const accounts = await getAllAccounts();
      const students = await getAllStudents();
      const teachers = await getAllTeachers();

      const usedAIds = new Set([
        ...students.map(student => student.account?.aId),
        ...teachers.map(teacher => teacher.account?.aId)
      ]);

      const requiredType = role === "STUDENT" ? 2 : 1;

      // Tìm danh sách tài khoản phù hợp theo name (aUid) chưa được sử dụng
      const availableAccounts = accounts.filter(acc =>
        acc.aType === requiredType &&
        acc.aUid.toLowerCase().includes(name.toLowerCase()) &&
        !usedAIds.has(acc.aId)
      );

      setSuggestedNames(availableAccounts.map(acc => acc.aUid)); // Cập nhật gợi ý

      return availableAccounts.length > 0 ? availableAccounts[0].aId : null;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
      throw error;
    }
  };
  const createUser = async (userData) => {
    try {
      const aId = await getAvailableAccount(userData.role, userData.name);
      if (!aId) throw new Error("Không có tài khoản khả dụng cho tên này");

      if (userData.role === "TEACHER") {
        const teacherData = {
          tcName: userData.name,
          aId: aId,
          tcEmail: userData.email,
          tcDob: userData.dob || "",
          tcPhoneNumber: userData.phoneNumber || "",
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
          aId: aId,
          svEmail: userData.email,
          svDob: userData.dob || "",
          svPhoneNumber: userData.phoneNumber || "",
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
      const updatedData = userData.role === "TEACHER" ? {
        tcName: userData.name,
        tcEmail: userData.email,
        tcDob: userData.dob,
        tcPhoneNumber: userData.phoneNumber, // Sửa lỗi P -> p
        tcGender: userData.gender,
        tcImage: userData.image || "image_url",
        tcRole: "Teacher",
        tcStatus: 1,
        jsonData: "{}"
      } : {
        svName: userData.name,
        svEmail: userData.email,
        svDob: userData.dob,
        svPhoneNumber: userData.phoneNumber, // Sửa lỗi P -> p
        svGender: userData.gender,
        svImage: userData.image || "image_url",
        svAddress: userData.address || "N/A",
        svFbUrl: userData.fbUrl || "http://facebook.com/default",
        svRole: "Student",
        svStatus: 1,
        jsonData: "{}"
      };

      return userData.role === "TEACHER"
        ? await updateTeacher(userId, updatedData)
        : await updateStudent(userId, updatedData);
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      throw error;
    }
  };
  return (
    <div className="p-6">
      <Navbar></Navbar>
      <div className="user-management">
        <div className="user-container">
          <div className="User-infor" >
          <h2 className="user-title">Quản lý người dùng</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>Họ và Tên</th>
                <th>Vai trò</th>
                <th>Email</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="edit-button" onClick={() => showModal(user)}>Sửa</button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &#60;
              </button>
              <span className="pagination-text">Trang {currentPage} / {totalPages}</span>
              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &#62;
              </button>
            </div>
          )}
          </div>
          <div className="user-option">
          <button className="export" onClick={toggleForm}>
            {showForm ? "Đóng form" : "Thêm người dùng"}
          </button>
          <button className="btn-create" onClick={toggleModal}>Tạo tài khoản</button>
          </div>
        </div>

        {isOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Tạo tài khoản</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" name="aUid" placeholder="Tên tài khoản" value={formData.aUid} onChange={handleChange} required />
                <input type="password" name="aPwd" placeholder="Mật khẩu" value={formData.aPwd} onChange={handleChange} required />
                <select name="aType" value={formData.aType} onChange={handleChange}>
                  <option value="2">Sinh viên</option>
                  <option value="1">Giáo viên</option>
                </select>
                <div className="modal-buttons">
                  <button type="submit">Lưu</button>
                  <button type="button" onClick={toggleModal} className="cancel-btn">Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}


        {showForm && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
              <input
                placeholder="Họ và Tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                list="nameSuggestions"
              />
              <datalist id="nameSuggestions">
                {suggestedNames.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select value={form.role} onChange={handleRoleChange} disabled={!!editingUser}>
                <option value="STUDENT">Sinh viên</option>
                <option value="TEACHER">Giáo viên</option>
              </select>

              <input type="date" placeholder="Ngày sinh" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              <input placeholder="Số điện thoại" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>

              {form.role === "STUDENT" && (
                <>
                  <input placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <input placeholder="Facebook URL" value={form.fbUrl} onChange={(e) => setForm({ ...form, fbUrl: e.target.value })} />
                </>
              )}

              <div className="button-group">
                <button className="save-btn" onClick={handleOk}>Lưu</button>
                <button className="cancel-btn" onClick={toggleForm}>Hủy</button>
              </div>
            </div>
          </div>
        )}

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