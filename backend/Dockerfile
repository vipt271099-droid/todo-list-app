# Stage 1: Sử dụng base image Node.js
FROM node:18-alpine AS base

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port mà ứng dụng sẽ chạy
EXPOSE 3001

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
