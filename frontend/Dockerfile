# ---- Stage 1: Build ----
# Sử dụng base image Node.js để build project React
FROM node:18-alpine AS build

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code của frontend
COPY . .

# Build project
RUN npm run build

# ---- Stage 2: Serve ----
# Sử dụng Nginx để serve các file static đã được build
FROM nginx:stable-alpine

# Copy các file đã build từ stage 'build' vào thư mục public của Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx
# File này cần thiết để xử lý routing của React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Lệnh mặc định để khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
