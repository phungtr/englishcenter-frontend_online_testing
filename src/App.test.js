import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

// Hàm render tiện ích để bọc App trong MemoryRouter với route khởi tạo.
const renderWithRouter = (initialEntries) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App Routing', () => {
  test('renders login page at route "/"', () => {
    renderWithRouter(['/']);
    // Giả sử LoginPage chứa text "login" (không phân biệt chữ hoa chữ thường)
    const loginElements = screen.getAllByText(/login/i);
    expect(loginElements.length).toBeGreaterThan(0);
  });

  test('renders staff home page at route "/Staff-home"', () => {
    renderWithRouter(['/Staff-home']);
    // Giả sử StaffHome có chứa text "staff home"
    const homeLinks = screen.getAllByText(/Trang chủ/i);
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  test('renders teacher home page at route "/Teacher-home"', () => {
    renderWithRouter(['/Teacher-home']);
    // Giả sử TeacherHome có chứa text "teacher home"
    const teacherHomeElement = screen.getByText(/Trang chủ Giáo viên/i);
    expect(teacherHomeElement).toBeInTheDocument();
  });

  test('renders student home page at route "/Student-home"', () => {
    renderWithRouter(['/Student-home']);
    // Giả sử StudentHome có chứa text "student home"
    const studentHomeElement = screen.getByText(/Trang chủ học viên/i);
    expect(studentHomeElement).toBeInTheDocument();
  });

  test('renders teaching schedule report page at route "/teaching-schedule-report"', () => {
    renderWithRouter(['/teaching-schedule-report']);
  
    // Lấy tất cả các phần tử có chứa nội dung "Báo cáo lịch giáo viên"
    const reportElements = screen.getAllByText((content) => {
      const normalizedText = content.replace(/\s+/g, ' ').trim().toLowerCase();
      return normalizedText.includes('báo cáo lịch giáo viên');
    });
  
    // Kiểm tra rằng số lượng phần tử trả về lớn hơn 0
    expect(reportElements.length).toBeGreaterThan(0);
  
    // Nếu bạn muốn xác định phần tử cụ thể làm tiêu đề (ví dụ <h2>), chọn phần tử có tag <h2>
    const reportHeading = reportElements.find(el => el.tagName.toLowerCase() === 'h2');
    // Nếu không tìm thấy, lấy phần tử đầu tiên
    expect(reportHeading || reportElements[0]).toBeInTheDocument();
  });
  test('renders user management page at route "/user-management"', () => {
    renderWithRouter(['/user-management']);
    // Giả sử UserManagement có chứa text "user management"
    const userManagementElements = screen.getAllByText(/Quản lý người dùng/i);
    expect(userManagementElements.length).toBeGreaterThan(0);
  });

  test('renders statistics page at route "/statistics"', () => {
    renderWithRouter(['/statistics']);
    // Giả sử Statistics có chứa text "statistics"
    const statisticsElements = screen.getAllByText(/Thống kê/i);
    expect(statisticsElements.length).toBeGreaterThan(0);
  });

  test('renders teacher schedule page at route "/teacher-schedule"', () => {
    renderWithRouter(['/teacher-schedule']);
  
    const teacherScheduleElement = screen.getByText((content) => {
      const normalizedText = content.replace(/\s+/g, ' ').trim().toLowerCase();
      return normalizedText.includes('thời khóa biểu');  // chú ý dùng chữ thường
    });
    expect(teacherScheduleElement).toBeInTheDocument();
  });
  
  test('renders student schedule (timetable) page at route "/student-schedule"', () => {
    renderWithRouter(['/student-schedule']);
  
    // Lấy tất cả các phần tử có chứa nội dung "Thời khóa biểu"
    const scheduleElements = screen.getAllByText((content) => {
      const normalizedText = content.replace(/\s+/g, ' ').trim().toLowerCase();
      return normalizedText.includes('thời khóa biểu');
    });
  
    // Kiểm tra rằng ta đã tìm được ít nhất một phần tử
    expect(scheduleElements.length).toBeGreaterThan(0);
  
    // Nếu bạn muốn kiểm tra cụ thể phần tiêu đề (h2), hãy tìm phần tử có tag <h2>
    const scheduleHeading = scheduleElements.find(el => el.tagName.toLowerCase() === 'h2');
    expect(scheduleHeading).toBeInTheDocument();
  });

  test('renders class management page at route "/class-management"', () => {
    renderWithRouter(['/class-management']);
    const allElements = screen.getAllByText(/quản lý lớp học/i);
    const headingElement = allElements.find(el => el.tagName.toLowerCase() === 'h2');
    expect(headingElement).toBeInTheDocument();
  });
  
});
