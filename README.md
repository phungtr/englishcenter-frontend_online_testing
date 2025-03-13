# Hệ Thống Quản Lý Trung Tâm Tiếng Anh (Frontend)

Dự án này là một hệ thống quản lý trung tâm tiếng Anh trên nền tảng web, được xây dựng bằng React.

## Tính Năng
- Xác thực người dùng (đăng nhập/đăng xuất)  
- Bảng điều khiển với quản lý học viên và lớp học  
- Các thao tác CRUD cho học viên, giáo viên và khóa học  
- Báo cáo và thống kê  

## Cài Đặt  
Để thiết lập dự án trên máy tính của bạn, hãy làm theo các bước sau:

### Yêu Cầu  
- Node.js (khuyến nghị phiên bản LTS mới nhất)  
- npm hoặc yarn  

### Sao Chép Kho Lưu Trữ  
```sh
git clone https://github.com/phungtr/englishcenter-frontend_online_testing.git
cd .\englishcenter_frontend_online_testing\


### Cài đặt các gói phụ thuộc
```sh
npm install
```

### Chạy ứng dụng
```sh
npm start
```
Ứng dụng sẽ chạy tại `http://localhost:3000`.

## Chạy kiểm thử
Dự án này bao gồm các bài kiểm thử giao diện người dùng (UI) bằng Jest và React Testing Library.
Để chạy kiểm thử, sử dụng lệnh sau:
```sh
npm test
```

## Cấu trúc thư mục
```
english-center-management/
│── src/
│   ├── components/        # Reusable components
│   ├── pages/             # Application pages
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   ├── context/           # Context API for state management
│── public/                # Static assets
│── package.json           # Dependencies and scripts
│── README.md              # Project documentation
```

## Người đóng góp
- Phùng Quang Trà  - Developer 

