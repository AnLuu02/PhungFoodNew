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


## 📌 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Hãy fork repo, tạo branch mới và gửi Pull Request.

✨ **Fast Food App - Next.js 14** 🚀

