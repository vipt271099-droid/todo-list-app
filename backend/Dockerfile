# Production Dockerfile (default for Render deployment)
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json (package-lock.json nếu có)
COPY package*.json ./

# Cài đặt chỉ production dependencies
RUN npm install --only=production

# Copy toàn bộ source code
COPY . .

# Expose port mà ứng dụng sẽ chạy
EXPOSE 3001

# Lệnh để chạy ứng dụng production
CMD ["npm", "start"]
