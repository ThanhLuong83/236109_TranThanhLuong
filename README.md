# Đồ án Điện toán đám mây - Hệ thống Quản lý Món ăn

**Sinh viên thực hiện:** Trần Thanh Lượng  
**MSSV:** 236109  

---

## 1. Giới thiệu đề tài & Công nghệ
Hệ thống quản lý món ăn cho phép thực hiện các chức năng CRUD (Thêm, Xem, Sửa, Xóa) và Tìm kiếm món ăn trực tuyến trên nền tảng đám mây.

* **Frontend:** React (Vite)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Containerization:** Docker, Docker Hub
* **Cloud Hosting:** Render

---

## 2. Cấu trúc dự án
```text
236109_TranThanhLuong/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── src/
│   └── .env
├── .gitignore
└── README.md

3. Hướng dẫn chạy local bằng Docker

    Tải và chạy Backend Container: docker run -d -p 5000:5000 --name backend-app -e MONGODB_URI="mongodb+srv://tranthanhluong11102004st_db_user:uwKYaP76OX6quwXN@cluster0.lzlvwkx.mongodb.net/236109_TranThanhLuong?retryWrites=true&w=majority" thanhluong83/backend:latest

    Tải và chạy Frontend Container: docker run -d -p 80:80 --name frontend-app thanhluong83/frontend:latest

4. Docker Images

    Backend Image: thanhluong83/backend:latest
    Frontend Image: thanhluong83/frontend:latest

5. Triển khai Cloud (Render)

    URL Frontend Web App: https://frontend-236109-tranthanhluong.onrender.com
    URL Backend API: https://backend-236109-tranthanhluong.onrender.com