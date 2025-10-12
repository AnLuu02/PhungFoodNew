# 🍔 Fast Food Restaurant App — Next.js 14 Full‑Stack Project

## 🌟 Introduction  
**Fast Food Restaurant App** is a full-stack web application delivering a smooth, scalable, and production-ready online ordering experience.  
Built with **Next.js 14 (App Router)**, the project demonstrates a command of frontend performance, strong API design, and real business workflows from product browsing to payment and invoice automation.

---

## 🖼️ Preview / Screenshots  

![Home page](./screenshots/homepage.png)
![Cart page](./screenshots/cartpage.png)
![Menu page](./screenshots/menupage.png)
![Admin dashboard](./screenshots/admindashboard.png)
---

## 🚀 Technical Highlights  
- **Next.js 14 (App Router)** for modern routing, edge rendering, and server actions  
- **NextAuth** for secure user authentication & session handling  
- **tRPC + Prisma** for end-to-end type safety between client and server  
- **PostgreSQL** as relational datastore  
- **Mantine + Tailwind CSS** for component-driven design & utility styling  
- **VNPAY API** integration for real-world payment processing  
- **PDFKit & Nodemailer** for automated invoice generation and email delivery  
- **Voice Search (desktop)** for intuitive product discovery  
- **Admin Dashboard** with analytics, sales insights, and order management  

---

## 🧩 Architecture & Modules  

```
Frontend:   Next.js 14 (App Router + Server / Client components)
Backend API: tRPC endpoints
Database:   Prisma schema on PostgreSQL
Auth:       NextAuth (session / JWT)
UI:         Mantine components + Tailwind utilities
Payments:   VNPAY integration
PDF / Email: PDFKit + Nodemailer
```

**Principles:**
- Maintainable modular architecture  
- Type safety across boundaries  
- Separation of concerns  
- Realistic business logic & secure workflows  

---

## 🛠️ Installation & Run  

1. **Clone the repo**  
   ```bash
   git clone https://github.com/AnLuu02/PhungFoodNew.git  
   cd PhungFoodNew
   ```

2. **Install dependencies**  
   ```bash
   yarn install   # or npm install
   ```

3. **Set environment variables** in `.env`:  
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/fastfood
   VNP_TMNCODE=...
   VNP_HASHSECRET=...
   VNP_URL=...
   NEXTAUTH_SECRET=...
   EMAIL_SERVER=...
   EMAIL_FROM=...
   ```

4. **Push database schema**  
   ```bash
   npx prisma db push
   ```

5. **Start dev server**  
   ```bash
   yarn dev   # or npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000)

---

## 🧠 Key Features (User & Admin)

| Category | Highlights |
|---|---|
| **Auth & Security** | Sign up, login, session protection |
| **Product Management** | CRUD for categories, subcategories, products |
| **Cart & Checkout** | Persistent cart, real-time updates |
| **Payment Flow** | VNPAY integration with callback & validation |
| **Invoice System** | Generate PDF invoices & auto-send email |
| **Admin Analytics** | Dashboard with charts, revenue, order data |
| **Voice Search** | Search products by voice input (on desktop) |
| **Responsive Design** | Mobile / tablet / desktop support |
| **Ratings & Reviews** | Users can leave feedback on products |

---

## 🎬 Live Demo  
Check it live here: [Phung Food App](https://phung-food-new.vercel.app/)

---

## 🧩 Project Goals & Intentions  
This project is intended to:
- Showcase full-stack mastery (Next.js + tRPC + Prisma)  
- Simulate a real-world product / business workflow  
- Emphasize **UI polish**, **UX**, and **performance**  
- Demonstrate integration with external services (payment, email, PDF)  
- Serve as a portfolio piece that speaks technically and visually  

---

## 🧑‍💻 About the Developer  
Hello! I’m **An Luu** — a frontend web developer with a strong eye for clean UI and smooth user experience.  
I specialize in **Next.js**, **React**, and modern frontend technologies, with hands-on experience in **backend integration** using **tRPC**, **Prisma**, and **PostgreSQL**.


📫 Contact me:  
- **Email:** anluu099@gmail.com  
- **LinkedIn:** [https://www.linkedin.com/in/l%C6%B0u-an-526510321/] 

---

## 📄 License  
This project is released under the **MIT License**.

---

✨ *Refered, Designed & coded with care — by An Luu.*  
