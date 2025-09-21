# Development Dockerfile for hot reload
FROM node:20-alpine

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port cho Vite dev server
EXPOSE 5173

# Chạy development server với hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
