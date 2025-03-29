# 🍽 Nhà Hàng Fast Food - Next.js 14

## 📝 Giới Thiệu
Đây là ứng dụng website nhà hàng fast food được xây dựng bằng **Next.js 14**, sử dụng **App Router**, **tRPC**, **Prisma**, **PostgreSQL** và các công nghệ hiện đại khác. Ứng dụng hỗ trợ:

- 🛒 Đặt hàng trực tuyến.
- 💳 Thanh toán qua VNPAY.
- 📜 Xuất hóa đơn PDF.
- 📧 Gửi hóa đơn qua email.
- 📊 Dashboard quản trị viên.

## 🚀 Công Nghệ Sử Dụng
- **Next.js 14** với **App Router**
- **tRPC** v11
- **Prisma** ORM
- **PostgreSQL**
- **NextAuth** (Xác thực người dùng)
- **Mantine** (UI Components)
- **Tailwind CSS** (Styling)
- **VNPAY API** (Thanh toán)
- **PDFKit** (Xuất hóa đơn PDF)
- **Nodemailer** (Gửi email hóa đơn)

## 📂 Cấu Trúc Dự Án
```
📦 fastfood-app
├── 📂 src
│   ├── 📂 app (App Router)
│   ├── 📂 components (UI Components)
│   ├── 📂 lib (Helpers, config)
│   ├── 📂 server (API tRPC, Prisma)
│   ├── 📂 styles (Tailwind CSS)
│   ├── 📂 utils (Hàm tiện ích)
├── 📄 prisma/schema.prisma (Mô hình dữ liệu)
├── 📄 .env (Biến môi trường)
├── 📄 package.json (Dependencies)
└── 📄 README.md
```

## 🛠 Cài Đặt
### 1️⃣ Clone Repository
```sh
git clone https://github.com/yourusername/fastfood-app.git
cd fastfood-app
```

### 2️⃣ Cài Đặt Dependencies
```sh
yarn install  # hoặc npm install
```

### 3️⃣ Cấu Hình Biến Môi Trường
Tạo file `.env` và thêm các biến môi trường:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fastfood
VNP_TMNCODE=...
VNP_HASHSECRET=...
VNP_URL=...
NEXTAUTH_SECRET=...
EMAIL_SERVER=...
EMAIL_FROM=...
```

### 4️⃣ Chạy Prisma Migrations
```sh
yarn prisma migrate dev --name init
```

### 5️⃣ Chạy Ứng Dụng
```sh
yarn dev  # hoặc npm run dev
```
Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

## ✅ Tính Năng
- [x] Đăng nhập / Đăng ký với NextAuth.
- [x] Quản lý danh mục sản phẩm (Category, Subcategory, Product).
- [x] Giỏ hàng & Thanh toán VNPAY.
- [x] Quản lý đơn hàng & Xuất hóa đơn PDF.
- [x] Gửi email xác nhận đơn hàng.
- [x] Dashboard quản trị viên.
- [x] Hỗ trợ tìm kiếm và lọc sản phẩm.
- [x] Responsive trên mọi thiết bị.
- [x] Hệ thống đánh giá sản phẩm.
- [x] Thống kê doanh thu và đơn hàng.

## 🎥 Demo
Truy cập bản demo tại: [Phung Food](https://phung-food-new.vercel.app/)

## 📌 Đóng Góp
Mọi đóng góp đều được hoan nghênh! Hãy fork repo, tạo branch mới và gửi Pull Request.

## 📝 Giấy Phép
Dự án này được phát hành theo giấy phép **MIT License**.

---
✨ **Fast Food App - Next.js 14** 🚀

Cảm ơn bạn đã quan tâm đến dự án này! Nếu bạn có bất kỳ ý tưởng nào để cải thiện hoặc gặp vấn đề khi sử dụng, đừng ngần ngại mở issue hoặc liên hệ trực tiếp.

