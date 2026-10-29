# Đồ án Điện toán đám mây - Hệ thống Quản lý Món ăn

**Sinh viên thực hiện:** Trần Thanh Lượng
**MSSV:** 236109

## 1. Giới thiệu đề tài & Công nghệ
Hệ thống quản lý món ăn cho phép thực hiện các chức năng CRUD và tìm kiếm món ăn trên nền tảng đám mây.

* **Frontend:** React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Containerization:** Docker, Docker Hub
* **Cloud Hosting:** Render

## 2. Cấu trúc dự án
236109_TranThanhLuong/
├── backend/
├── frontend/
├── .gitignore
└── README.md

## 4. Docker Images
* Backend Image: thanhluong83/backend:latest
* Frontend Image: thanhluong83/frontend:latest

### Hướng dẫn chạy bằng Docker:
```bash
docker run -d -p 5000:5000 --name backend-app -e MONGODB_URI="chuoi_mongodb_atlas" thanhluong83/backend:latest
docker run -d -p 80:80 --name frontend-app thanhluong83/frontend:latest


URL frontend: https://frontend-236109-tranthanhluong.onrender.com/
URL backend: https://backend-236109-tranthanhluong.onrender.com/
