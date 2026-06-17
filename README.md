# Loyalty System

## Latar Belakang Masalah
Aplikasi ini dibuat untuk membantu bisnis retail atau toko dengan sistem loyalitas pelanggan yang masih dikelola secara manual. Masalah yang sering muncul adalah:

- data member tersebar dan sulit dilacak,
- penghitungan poin tidak konsisten,
- proses redeem reward sulit diawasi,
- admin kesulitan melihat transaksi dan aktivitas pengguna secara real-time.

Dengan sistem ini, proses pencatatan member, transaksi, poin, reward, serta audit log dapat dilakukan dalam satu platform yang terstruktur.

---

## Tujuan Aplikasi
Aplikasi ini bertujuan untuk:

- mengelola data anggota loyalitas,
- mencatat transaksi pembelian dan otomatis menghitung poin,
- memantau saldo poin member,
- mengelola reward yang bisa ditukarkan member,
- menyediakan dashboard untuk melihat performa bisnis,
- menjaga keamanan data melalui autentikasi dan role-based access.

---

## Fitur Utama
- Autentikasi pengguna (login/register)
- Manajemen member
- Pencatatan transaksi dan perhitungan poin otomatis
- Redeem reward berdasarkan saldo poin
- Dashboard ringkasan bisnis
- Audit log aktivitas sistem
- Profil pengguna dan perubahan password

---

## Teknologi yang Digunakan

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT untuk autentikasi
- Docker untuk lingkungan development

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS
- Axios
- React Query

---

## Arsitektur Aplikasi
Secara umum, aplikasi terdiri dari:

- **Frontend** untuk antarmuka pengguna
- **Backend API** untuk logika bisnis dan validasi
- **Database** untuk menyimpan data member, transaksi, reward, dan log audit
- **Docker Compose** untuk menjalankan seluruh layanan secara konsisten

---

## Cara Menjalankan Aplikasi

### 1. Clone repository
```bash
git clone <repo-url>
cd loyalty-system
```

### 2. Jalankan semua layanan dengan Docker
```bash
docker-compose up --build
```

Aplikasi akan tersedia di:
- Frontend: http://localhost:3000
- Backend: http://localhost:5556
- MySQL: http://localhost:3306

### 3. Setup database
Jika backend belum menjalankan migrasi dan seed data, jalankan:

```bash
cd backend
npm install
npx prisma migrate dev
node prisma/seed.js
```

### 4. Jalankan backend secara manual (opsional)
```bash
cd backend
npm run dev
```

### 5. Jalankan frontend secara manual (opsional)
```bash
cd frontend
npm install
npm run dev
```

---

## Variabel Environment
Backend menggunakan file environment untuk konfigurasi seperti:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`

Untuk development, nilai default sudah diatur melalui Docker Compose.

---

## Tantangan Teknis yang Berhasil Diselesaikan

### 1. Konsistensi data poin saat transaksi
Salah satu tantangan utama adalah memastikan poin member bertambah secara akurat saat transaksi berhasil. Solusi yang digunakan adalah menjalankan proses pembuatan transaksi dan update saldo poin dalam satu transaksi database agar tidak terjadi data yang tidak konsisten.

### 2. Pencegahan redeem poin yang tidak valid
Sistem perlu memastikan member tidak bisa menukar reward jika saldo poin kurang dari yang dibutuhkan. Proses validasi dilakukan sebelum transaksi redeem diproses, lalu update saldo poin dan catatan redeem dijalankan dalam satu transaksi.

### 3. Audit log untuk transparansi
Setiap aksi penting seperti login, perubahan profil, pembuatan member, transaksi, dan redeem dicatat dalam audit log. Ini membantu tim operasional melacak aktivitas yang terjadi di sistem.

### 4. Role-based access control
Tidak semua user boleh mengakses fitur yang sama. Sistem membatasi akses berdasarkan peran (`ADMIN` dan `STAFF`) agar data sensitif tetap aman.

### 5. Integrasi frontend dan backend yang rapi
Frontend dibuat agar dapat berinteraksi dengan API backend dengan pola routing yang jelas dan state management yang sederhana, sehingga pengguna lebih mudah memahami alur kerja aplikasi.

---

## Struktur Proyek
```bash
backend/   # API server dan logika bisnis
frontend/  # Antarmuka pengguna
Dockerfile # konfigurasi container
docker-compose.yml # orchestrasi layanan
```

---

## Kesimpulan
Proyek ini bukan hanya sekadar demo CRUD, tetapi merupakan sistem yang mencoba menyelesaikan masalah nyata di dunia retail: bagaimana mengelola loyalitas pelanggan secara rapi, aman, dan dapat diaudit. Fokus utamanya adalah pada akurasi data, keamanan akses, dan pengalaman pengguna yang sederhana.
