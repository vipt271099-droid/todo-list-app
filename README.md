To-do List App (React + Node.js)
Dự án web To-do List đơn giản sử dụng ReactJS cho frontend và Node.js (Express) cho backend, được đóng gói bằng Docker.

Yêu cầu
Docker

Docker Compose

Cài đặt và Khởi chạy
Clone a repository:

git clone <your-repo-url>
cd todo-list-app

Tạo file môi trường cho backend:
Tạo một file tên là .env trong thư mục backend từ file backend/.env.example.

cp backend/.env.example backend/.env

Mở file backend/.env và điền các giá trị cần thiết:

# Port cho server

PORT=3001

# Chuỗi kết nối đến database PostgreSQL trên Render

DATABASE_URL=postgres://...

# Chuỗi bí mật cho JWT

JWT_SECRET=your_super_secret_jwt_string

Cài đặt node modules (Lần đầu chạy):
Việc này giúp IDE của bạn nhận diện được các thư viện.

cd backend && npm install && cd ..
cd frontend && npm install && cd ..

Khởi chạy bằng Docker Compose:
Từ thư mục gốc todo-list-app, chạy lệnh:

docker-compose up --build

--build: Xây dựng lại images nếu có thay đổi trong Dockerfile.

Truy cập ứng dụng:

Frontend: http://localhost:8080

Backend API: http://localhost:3001/api

Dừng ứng dụng
Nhấn Ctrl + C trong terminal và chạy lệnh:

docker-compose down
