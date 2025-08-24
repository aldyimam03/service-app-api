# service-app-api

API untuk sistem pemesanan servis kendaraan yang dikembangkan dengan arsitektur seperti MVC menggunakan Node.js, Express.js, dan MySQL.

## 🎯 Features

- **Customer Features:**
  - Pemesanan servis kendaraan online
  - Pengecekan status pemesanan berdasarkan nomor telepon

- **Dealer Features:**
  - Login/logout system dengan JWT authentication
  - Mengelola jadwal servis (CRUD operations)
  - Melihat daftar pemesanan
  - Mengubah status pemesanan
  - Melihat Statistik pemesanan

## 🛠️ Tech Stack

- **Arsitektur:** seperti MVC (Model, View(diganti dengan JSON), Controller) 
- **Framework:** Express.js
- **Backend:** Node.js
- **ORM:** Tidak Menggunakan ORM seperti Prisma/Sequelize (tidak ada dalam ketentuan)
- **Database:** MySQL 5.7+
- **Authentication:** JWT (JSON Web Tokens)
- **Authorization:** Admin role by username
- **Validation:** Joi
- **Security:** Helmet
- **Password Hashing:** bcryptjs

## 📋 Prerequisites

Pastikan sudah ter-install:
- **Node.js** v16+ (direkomendasikan v20)
- **MySQL** 5.7+ 
- **npm** 
- **Git**

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/aldyimam03/service-app-api.git
cd service-app-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
#### Jika menggunakan phpMyAdmin (Laragon/XAMPP):
1. Buka phpMyAdmin (http://localhost/phpmyadmin)
2. Buat database baru bernama: `vehicle_service_db`
3. Pilih database `vehicle_service_db`
4. Pergi ke tab "SQL"
5. Copy paste seluruh isi file `mysql/schema.sql`
6. Klik "Go" untuk menjalankan

#### Jika menggunakan MySQL Command Line:
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE vehicle_service_db;
USE vehicle_service_db;

# Import schema
SOURCE mysql/schema.sql;

# Exit MySQL
EXIT;
```

### 4. Setup Environment Variables
```bash
# Copy file environment template
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi database Anda:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=vehicle_service_db

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
```

### 5. Verify Database Connection
Jalankan server untuk test koneksi database:
```bash
npm run dev
```

Jika berhasil, akan muncul:
```
✅ Database connected successfully
✅ Admin dealer created successfully. (hanya saat pertama kali dijalankan)
      ================================================
      ||  Server running on: http://localhost:3000  ||
      ================================================
```

### 6. Use Seeder (Optional but recommended)
Jika tidak menggunakan seeder maka data harus sibuat secara manual untuk tes fitur, namun jika ingin menggunakan seeder :
```bash
npm run seed
```

### 7. Test API
Buka browser dan akses: http://localhost:3000
Seharusnya menampilkan welcome message API.

## 📖 API Endpoints

### 🔓 Public Endpoints (Tanpa Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login dealer |
| `POST` | `/api/bookings` | Buat pemesanan baru |
| `GET` | `/api/bookings/check` | Cek pemesanan berdasarkan nomor telepon |

### 🔒 Protected Endpoints (Dealer Only - Butuh JWT Token)

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/profile` | Dapatkan profil dealer |
| `POST` | `/api/auth/logout` | Logout dealer |

#### Schedules Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schedules` | Dapatkan semua jadwal |
| `POST` | `/api/schedules` | Buat jadwal baru |
| `PUT` | `/api/schedules/:id/quota` | Update kuota jadwal |
| `DELETE` | `/api/schedules/:id` | Hapus jadwal |

#### Bookings Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | Dapatkan semua pemesanan |
| `GET` | `/api/bookings/:id` | Dapatkan pemesanan berdasarkan ID |
| `GET` | `/api/bookings/status/:status` | Dapatkan pemesanan berdasarkan status |
| `GET` | `/api/bookings/statistics` | Dapatkan statistik pemesanan |
| `PUT` | `/api/bookings/:id/status` | Update status pemesanan |

## 🧪 Testing API

### Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

### 1. Test dengan Browser
- Welcome API: http://localhost:3000
- Available Schedules: http://localhost:3000/api/schedules/available

### 2. Test dengan Postman

**❗ PENTING:** Copy `token` dari response untuk mengakses endpoint protected!

#### Dokumentasi API dengan Postman
- Dokumentasi API by Postmman : https://documenter.getpostman.com/view/25300036/2sB3BLjniL

## ⚙️ Scripts

```bash
# Development (auto-reload)
npm run dev

# Install dependencies
npm install
```

## 🔧 Troubleshooting

### Database Connection Error
```bash
❌ Database connection failed: ER_ACCESS_DENIED_FOR_USER
```
**Solusi:**
- Pastikan username/password MySQL di `.env` benar
- Pastikan MySQL service sedang running
- Test koneksi manual: `mysql -u root -p`

### Port Already in Use
```bash
❌ Error: listen EADDRINUSE: address already in use :::3000
```
**Solusi:**
- Ganti PORT di `.env` file: `PORT=3001`
- Atau stop aplikasi yang menggunakan port 3000

### JWT Token Invalid
```bash
❌ Invalid or expired token
```
**Solusi:**
- Login ulang untuk mendapat token baru
- Pastikan format header: `Authorization: Bearer YOUR_TOKEN`
- Check JWT_SECRET di `.env`

### Schema Import Error
**Solusi:**
- Pastikan database `vehicle_service_db` sudah dibuat
- Jalankan schema.sql satu per satu jika ada error
- Check MySQL version compatibility

## 📊 Database Schema

### Default Data
- **Dealer Account:** username: `admin`, password: `admin123`

### Status Pemesanan
1. `menunggu konfirmasi` - Default saat booking dibuat
2. `konfirmasi batal` - Dibatalkan dealer (kuota kembali bertambah)
3. `konfirmasi datang` - Dikonfirmasi dealer
4. `tidak datang` - Customer tidak datang
5. `datang` - Customer datang 

## 🔒 Security Features

- JWT Authentication untuk dealer endpoints
- Authorization untuk otorisasi admin
- Input validation dengan Joi
- SQL injection protection
- Password hashing dengan bcrypt
- Security headers dengan Helmet

## 🎯 Business Rules (sesuai dengan ketentuan)

- ✅ Pemesanan hanya untuk H+1 (besok atau lebih)
- ✅ Kuota otomatis berkurang saat ada booking
- ✅ Kuota kembali bertambah jika booking berstatus konfirmasi batal
- ✅ Multiple booking walaupun dengan data yang sama diperbolehkan (selama ada kuota)
- ❌ Tidak bisa booking di jadwal yang tidak ada
- ❌ Tidak bisa buat schedule duplikat (tanggal yang sama)

## 👨‍💻 Development Notes

Project ini dibuat untuk test Backend Developer dengan requirements:
- Node.js + Express.js
- Tidak ada ketentuan menggunakan ORM
- MySQL database
- RESTful API design
- JWT Authentication
- Input validation
- Clean code structure (MVC) dan kedepannya akan dikembangkan dengan reppository pattern

## TERIMA KASIH 🙏🏻