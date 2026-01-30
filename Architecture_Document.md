# Dokumen Arsitektur Proyek - Open API Perpustakaan

**Nama Project:** Library Open API (Project Akhir)
**Nama:** Jihadut Tolibin
**Nim:** 20230140125

---

## 1. General
Sistem ini adalah platform Open API untuk manajemen dan konsumsi data perpustakaan buku. Aplikasi ini mendukung sistem **Dual API Key** (Internal & External) yang memungkinkan pengembang pihak ketiga untuk mengakses data buku secara terprogram melalui sandbox yang disediakan.

---

## 2. Three-Tier Architecture (Arsitektur Tiga Tingkat)
Sistem ini dibangun menggunakan arsitektur tiga lapis untuk memastikan pemisahan tanggung jawab yang jelas:

| Lapisan (Tier) | Komponen Utama | Teknologi / Tugas |
| :--- | :--- | :--- |
| **1. Presentation Tier** | Web Application Dashboard | **React (Vite) & Modern CSS**. Menangani antarmuka pengguna, manajemen API Key secara visual, dan pengujian API melalui Sandbox UI Premium. |
| **2. Application Tier** | API Server (Business Logic) | **Node.js (Express)**. Mengelola logika bisnis, autentikasi JWT, validasi Dual API Key (Internal/External), dan pemrosesan unggahan file buku menggunakan Multer. |
| **3. Data Tier** | MySQL Database | **MySQL**. Menyimpan data terstruktur untuk pengguna, riwayat pendaftaran API Key, dan metadata buku. Menjamin integritas data melalui skema relasional. |

---

## 3. Endpoints (RESTful API)

### A. Authentication & User Management
Tujuan untuk mengelola akses akun dan kunci pengembang.

| Tujuan | Metode | Endpoint | Akses |
| :--- | :--- | :--- | :--- |
| Registrasi Pengguna Baru | POST | `/api/auth/register` | Publik |
| Login Pengguna | POST | `/api/auth/login` | Publik |
| List API Key Aktif | GET | `/api/auth/keys` | User (JWT) |


### B. Data Master (Admin Access Only)
Endpoint untuk pengelolaan inventaris buku oleh administrator.

| Data Entitas | Tujuan | Metode | Endpoint |
| :--- | :--- | :--- | :--- |
| Buku | Tambah Buku (dengan Upload Foto) | POST | `/api/books` |
| Buku | Lihat Semua Buku (Full Data) | GET | `/api/books` |
| Buku | Update Buku (Edit Detail/Foto) | PUT | `/api/books/{id}` |
| Buku | Hapus Buku | DELETE | `/api/books/{id}` |

### C. Open API (Public & Virtual Access)
Endpoint yang digunakan oleh pengembang melalui integrasi API Key.

| Tujuan | Metode | Endpoint | Akses Key |
| :--- | :--- | :--- | :--- |
| Daftar Buku Project (Data Lokal) | GET | `/api/books/public` | API Key Internal |
| Daftar Buku Global (Data Simulasi) | GET | `/api/books/external` | API Key External |

---

**Catatan:** Seluruh endpoint Open API memerlukan header `x-api-key` untuk otorisasi, sedangkan endpoint Dashboard memerlukan header `Authorization: Bearer {token}`.
