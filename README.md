# IP-RMT60: Dokumentasi API Perangkat Xiaomi

Dokumen ini menyediakan detail komprehensif untuk API sisi server platform Perangkat Xiaomi, yang dibangun dengan Express.js, Sequelize, dan PostgreSQL. API ini memfasilitasi autentikasi pengguna, eksplorasi perangkat, dan pengelolaan perangkat favorit.

---

## Daftar Isi

1. [Model](#models)
2. [Hubungan](#relationships)
3. [Endpoint yang Tersedia](#available-endpoints)
4. [Endpoint Publik](#public-endpoints)
5. [Endpoint Terotentikasi](#authenticated-endpoints)
6. [Penanganan Error Global](#global-error-handling)

---

## Model

### User

Merepresentasikan pengguna terdaftar platform.

| Field    | Type   | Constraints      |
| -------- | ------ | ---------------- |
| username | String | Required         |
| email    | String | Required, Unique |
| password | String | Required         |

### XiaomiDevice

Merepresentasikan perangkat Xiaomi yang tersedia di platform.

| Field        | Type    | Constraints |
| ------------ | ------- | ----------- |
| key          | String  | Optional    |
| device_name  | String  | Optional    |
| device_image | String  | Optional    |
| display_size | String  | Optional    |
| display_res  | String  | Optional    |
| camera       | String  | Optional    |
| video        | String  | Optional    |
| ram          | String  | Optional    |
| chipset      | String  | Optional    |
| battery      | String  | Optional    |
| batteryType  | String  | Optional    |
| body         | String  | Optional    |
| os_type      | String  | Optional    |
| storage      | String  | Optional    |
| comment      | String  | Optional    |
| price        | Integer | Optional    |

### Favorite

Merepresentasikan perangkat Xiaomi favorit pengguna.

| Field          | Type    | Constraints |
| -------------- | ------- | ----------- |
| UserId         | Integer | Required    |
| XiaomiDeviceId | Integer | Required    |

---

## Hubungan

- **Many-to-Many**: Model `User` dan `XiaomiDevice` terhubung melalui model `Favorite` menggunakan hubungan many-to-many Sequelize.

---

## Endpoint yang Tersedia

### Endpoint Publik

- `POST /register` - Membuat akun pengguna baru
- `POST /login` - Mengautentikasi pengguna dan mengembalikan token akses
- `POST /login/google` - Mengautentikasi pengguna melalui Google OAuth
- `GET /public/devices` - Mengambil semua perangkat Xiaomi
- `GET /public/devices/:id` - Mengambil perangkat Xiaomi tertentu berdasarkan ID

### Endpoint Terotentikasi

- `GET /devices` - Mengambil semua perangkat Xiaomi (terotentikasi)
- `GET /devices/:id` - Mengambil perangkat Xiaomi tertentu berdasarkan ID (terotentikasi)
- `PUT /users/update` - Memperbarui informasi pengguna
- `POST /favorites/:XiaomiDeviceId` - Menambahkan perangkat Xiaomi ke favorit pengguna
- `GET /favorites` - Mengambil perangkat favorit pengguna
- `DELETE /favorites/:XiaomiDeviceId` - Menghapus perangkat Xiaomi dari favorit pengguna

---

## Endpoint Publik

### 1. POST /register

**Deskripsi**: Membuat akun pengguna baru.

**Body**:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 - Created)**:

```json
{
  "id": "integer",
  "username": "string",
  "email": "string"
}
```

**Response (400 - Bad Request)**:

```json
{
  "message": "Username tidak boleh null enkah kosong"
}
```

_Atau error validasi serupa untuk username, email, atau password._

**Response (400 - Bad Request)**:

```json
{
  "message": "Email must be unique"
}
```

---

### 2. POST /login

**Deskripsi**: Mengautentikasi pengguna dan mengembalikan token akses.

**Body**:

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 - OK)**:

```json
{
  "access_token": "string"
}
```

**Response (400 - Bad Request)**:

```json
{
  "message": "Email tidak boleh null"
}
```

_Atau_:

```json
{
  "message": "Password tidak boleh null"
}
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid email/password"
}
```

---

### 3. POST /login/google

**Deskripsi**: Mengautentikasi pengguna melalui Google OAuth dan mengembalikan token akses.

**Body**:

```json
{
  "token": "string"
}
```

**Response (200 - OK)**:

```json
{
  "access_token": "string"
}
```

**Response (400 - Bad Request)**:

```json
{
  "message": "Token tidak valid"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 4. GET /public/devices

**Deskripsi**: Mengambil semua perangkat Xiaomi yang tersedia di platform.

**Response (200 - OK)**:

```json
[
  {
    "id": 1,
    "device_name": "Xiaomi 14",
    "device_image": "https://example.com/xiaomi14.jpg",
    "display_size": "6.36 inches",
    "display_res": "1200 x 2670 pixels",
    "camera": "50 MP",
    "video": "8K@24fps",
    "ram": "8 GB",
    "chipset": "Snapdragon 8 Gen 3",
    "battery": "4610 mAh",
    "batteryType": "Li-Po",
    "body": "152.8 x 71.5 x 8.2 mm",
    "os_type": "Android 14",
    "storage": "256 GB",
    "comment": "Flagship device",
    "price": 9999999
  },
  ...
]
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 5. GET /public/devices/:id

**Deskripsi**: Mengambil detail perangkat Xiaomi tertentu berdasarkan ID-nya.

**Parameter**:

- `id` (wajib): ID Perangkat (integer)

**Response (200 - OK)**:

```json
{
  "id": 1,
  "device_name": "Xiaomi 14",
  "device_image": "https://example.com/xiaomi14.jpg",
  "display_size": "6.36 inches",
  "display_res": "1200 x 2670 pixels",
  "camera": "50 MP",
  "video": "8K@24fps",
  "ram": "8 GB",
  "chipset": "Snapdragon 8 Gen 3",
  "battery": "4610 mAh",
  "batteryType": "Li-Po",
  "body": "152.8 x 71.5 x 8.2 mm",
  "os_type": "Android 14",
  "storage": "256 GB",
  "comment": "Flagship device",
  "price": 9999999
}
```

**Response (404 - Not Found)**:

```json
{
  "message": "Device not found"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

## Endpoint Terotentikasi

Semua endpoint di bawah ini memerlukan header `Authorization` dengan token Bearer yang diperoleh dari endpoint `/login` atau `/login/google`.

**Headers**:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### 6. GET /devices

**Deskripsi**: Mengambil semua perangkat Xiaomi untuk pengguna terotentikasi.

**Response (200 - OK)**:

```json
[
  {
    "id": 1,
    "device_name": "Xiaomi 14",
    "device_image": "https://example.com/xiaomi14.jpg",
    "display_size": "6.36 inches",
    "display_res": "1200 x 2670 pixels",
    "camera": "50 MP",
    "video": "8K@24fps",
    "ram": "8 GB",
    "chipset": "Snapdragon 8 Gen 3",
    "battery": "4610 mAh",
    "batteryType": "Li-Po",
    "body": "152.8 x 71.5 x 8.2 mm",
    "os_type": "Android 14",
    "storage": "256 GB",
    "comment": "Flagship device",
    "price": 9999999
  },
  ...
]
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 7. GET /devices/:id

**Deskripsi**: Mengambil detail perangkat Xiaomi tertentu berdasarkan ID-nya untuk pengguna terotentikasi.

**Parameter**:

- `id` (wajib): ID Perangkat (integer)

**Response (200 - OK)**:

```json
{
  "id": 1,
  "device_name": "Xiaomi 14",
  "device_image": "https://example.com/xiaomi14.jpg",
  "display_size": "6.36 inches",
  "display_res": "1200 x 2670 pixels",
  "camera": "50 MP",
  "video": "8K@24fps",
  "ram": "8 GB",
  "chipset": "Snapdragon 8 Gen 3",
  "battery": "4610 mAh",
  "batteryType": "Li-Po",
  "body": "152.8 x 71.5 x 8.2 mm",
  "os_type": "Android 14",
  "storage": "256 GB",
  "comment": "Flagship device",
  "price": 9999999
}
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (404 - Not Found)**:

```json
{
  "message": "Device not found"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 8. PUT /users/update

**Deskripsi**: Memperbarui informasi pengguna terotentikasi.

**Body**:

```json
{
  "username": "string",
  "email": "string"
}
```

**Response (200 - OK)**:

```json
{
  "id": "integer",
  "username": "string",
  "email": "string"
}
```

**Response (400 - Bad Request)**:

```json
{
  "message": "Username tidak boleh null"
}
```

_Atau_:

```json
{
  "message": "Email tidak boleh null"
}
```

_Atau_:

```json
{
  "message": "Email must be unique"
}
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 9. POST /favorites/:XiaomiDeviceId

**Deskripsi**: Menambahkan perangkat Xiaomi ke favorit pengguna terotentikasi.

**Parameter**:

- `XiaomiDeviceId` (wajib): ID Perangkat (integer)

**Response (201 - Created)**:

```json
{
  "id": "integer",
  "UserId": "integer",
  "XiaomiDeviceId": "integer"
}
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (404 - Not Found)**:

```json
{
  "message": "Device not found"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 10. GET /favorites

**Deskripsi**: Mengambil perangkat favorit pengguna terotentikasi.

**Response (200 - OK)**:

```json
[
  {
    "id": 1,
    "UserId": 1,
    "XiaomiDeviceId": 1,
    "XiaomiDevice": {
      "id": 1,
      "device_name": "Xiaomi 14",
      "device_image": "https://example.com/xiaomi14.jpg",
      "display_size": "6.36 inches",
      "display_res": "1200 x 2670 pixels",
      "camera": "50 MP",
      "video": "8K@24fps",
      "ram": "8 GB",
      "chipset": "Snapdragon 8 Gen 3",
      "battery": "4610 mAh",
      "batteryType": "Li-Po",
      "body": "152.8 x 71.5 x 8.2 mm",
      "os_type": "Android 14",
      "storage": "256 GB",
      "comment": "Flagship device",
      "price": 9999999
    }
  },
  ...
]
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

### 11. DELETE /favorites/:XiaomiDeviceId

**Deskripsi**: Menghapus perangkat Xiaomi dari favorit pengguna terotentikasi.

**Parameter**:

- `XiaomiDeviceId` (wajib): ID Perangkat (integer)

**Response (200 - OK)**:

```json
{
  "message": "Device removed from favorites"
}
```

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (404 - Not Found)**:

```json
{
  "message": "Favorite not found"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```

---

## Penanganan Error Global

**Response (401 - Unauthorized)**:

```json
{
  "message": "Invalid token"
}
```

**Response (404 - Not Found)**:

```json
{
  "message": "User not found"
}
```

_Atau_:

```json
{
  "message": "Device not found"
}
```

_Atau_:

```json
{
  "message": "Favorite not found"
}
```

**Response (500 - Internal Server Error)**:

```json
{
  "message": "Internal server error"
}
```
