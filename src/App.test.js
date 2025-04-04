import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';  // Import MemoryRouter
import TeachingScheduleReport from './page/Staff/Teachingrepost';
import { schedules, createSchedule } from './sevrice/Api';

jest.mock('./sevrice/Api', () => ({
  createSchedule: jest.fn(),
  schedules: jest.fn(),
}));
describe('TeachingScheduleReport', () => {

  test('renders schedule report page correctly', () => {
    render(
      <BrowserRouter> {/* Wrap component with BrowserRouter */}
        <TeachingScheduleReport />
      </BrowserRouter>
    );

    // Check if the Navbar and other static content are displayed
    expect(screen.getByText(/Quản lý trung tâm tiếng Anh/i)).toBeInTheDocument();
  });

  test('handles form input changes correctly', () => {
    render(<BrowserRouter> {/* Wrap component with BrowserRouter */}
      <TeachingScheduleReport />
    </BrowserRouter>);

    // Open the form by clicking the "Tạo thời khóa biểu" button
    fireEvent.click(screen.getByText(/Tạo thời khóa biểu/i));

    // Check if the form is displayed
    expect(screen.getByPlaceholderText(/Ngày/i)).toBeInTheDocument();

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText(/Ngày/i), { target: { value: '2025-04-05' } });
    fireEvent.change(screen.getByPlaceholderText(/Giờ bắt đầu/i), { target: { value: '08:00' } });
    fireEvent.change(screen.getByPlaceholderText(/Giờ kết thúc/i), { target: { value: '10:00' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Xác nhận/i));

    // Check if the form was submitted correctly (you can assert form submission behavior here)
    expect(screen.getByPlaceholderText(/Ngày/i).value).toBe('2025-04-05');
    expect(screen.getByPlaceholderText(/Giờ bắt đầu/i).value).toBe('08:00');
    expect(screen.getByPlaceholderText(/Giờ kết thúc/i).value).toBe('10:00');
  });


  test('shows error message for invalid time range', () => {
    render(
      <BrowserRouter> 
        <TeachingScheduleReport />
      </BrowserRouter>
    );
  
    // Open the form
    fireEvent.click(screen.getByText(/Tạo thời khóa biểu/i));
  
    // Simulate user input for the form fields
    fireEvent.change(screen.getByPlaceholderText(/Ngày/i), { target: { value: '2025-04-05' } });
    fireEvent.change(screen.getByPlaceholderText(/Giờ bắt đầu/i), { target: { value: '12:00' } });
    fireEvent.change(screen.getByPlaceholderText(/Giờ kết thúc/i), { target: { value: '10:00' } });
  
    fireEvent.click(screen.getByText(/Xác nhận/i));
  
    // Check if the error message appears
    expect(screen.getByText(/Thời gian bắt đầu phải sớm hơn thời gian kết thúc!/i)).toBeInTheDocument();
  });

  
  test('submits form successfully', async () => {

    createSchedule.mockResolvedValueOnce({ 
      scheduleData: {
        classId: 'Class123',
        className: 'Math 101',
        teacherName: 'Mr. A',
        startTime: '2025-04-05T08:00:00',
        endTime: '2025-04-05T10:00:00',
        scheduleStatus: 1
      }
    });
    render(
      <BrowserRouter>
        <TeachingScheduleReport/>
      </BrowserRouter>
    );
  
    // Mở form
    fireEvent.click(screen.getByText(/Tạo thời khóa biểu/i));
  
    // Chờ form hiển thị
    await waitFor(() => {
      expect(screen.getByText(/Xác nhận/i)).toBeInTheDocument();
    });
  
    // Điền dữ liệu
    fireEvent.change(screen.getByPlaceholderText(/Ngày/i), { target: { value: '2025-04-05' } });
    fireEvent.change(screen.getByPlaceholderText(/Giờ bắt đầu/i), { target: { value: '08:00' } });
    fireEvent.change(screen.getByPlaceholderText(/Giờ kết thúc/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByPlaceholderText(/Mã lớp/i), { target: { value: 'Class123' } });
    fireEvent.change(screen.getByPlaceholderText(/Mã giáo viên/i), { target: { value: 'TC123' } });
  
    // Submit form
    fireEvent.click(screen.getByText(/Xác nhận/i));
  
    // Đảm bảo API gọi thành công
    await waitFor(() => {
      expect(createSchedule).toHaveBeenCalledTimes(1);
    });
  
    // Kiểm tra thông báo thành công (nếu có)
    expect(screen.queryByText(/Tạo thời khóa biểu thành công!/i)).toBeInTheDocument();
  });
  test('loads schedule data successfully', async () => {
    schedules.mockResolvedValueOnce([{
      classId: 'Class123',
      className: 'Math 101',
      teacherName: 'Mr. A',
      startTime: '2025-04-05T08:00:00',
      endTime: '2025-04-05T10:00:00',
      scheduleStatus: 1
    }]);

    render(<TeachingScheduleReport />);

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument();
    });
  });

  test('applies filters correctly', () => {
    const { rerender } = render(<TeachingScheduleReport />);

    fireEvent.change(screen.getByPlaceholderText(/Lọc theo giảng viên/i), { target: { value: 'Mr. A' } });
    fireEvent.change(screen.getByPlaceholderText(/Lọc theo khóa học/i), { target: { value: 'Math' } });

    rerender(<TeachingScheduleReport />);

    // Check if the schedule is filtered based on the input
    expect(screen.getByText('Math 101')).toBeInTheDocument();
  });
});