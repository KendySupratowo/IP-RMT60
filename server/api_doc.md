Xiaomi Devices API Documentation
Models
User

- username : string, required
- email : string, required, unique
- password : string, required

XiaomiDevice

- key : string
- device_name : string
- device_image : string
- display_size : string
- display_res : string
- camera : string
- video : string
- ram : string
- chipset : string
- battery : string
- batteryType : string
- body : string
- os_type : string
- storage : string
- comment : string
- price : integer

Favorite

- UserId : integer, required
- XiaomiDeviceId : integer, required

Relation - Many to Many
Perhatikan relasi antara User, Favorite, dan XiaomiDevice gunakan definisi relasi yang sesuai pada sequelize relation doc.
Endpoints
List of available endpoints:

POST /register
POST /login
POST /login/google
GET /public/devices
GET /public/devices/:id

Routes below need authentication:

GET /devices
GET /devices/:id
PUT /users/update
POST /favorites/:XiaomiDeviceId
GET /favorites
DELETE /favorites/:XiaomiDeviceId

1. POST /register
   Request:

body:

{
"username": "string",
"email": "string",
"password": "string"
}

Response (201 - Created)
{
"id": "integer",
"username": "string",
"email": "string"
}

Response (400 - Bad Request)
{
"message": "Username tidak boleh null"
}
OR
{
"message": "Username tidak boleh kosong"
}
OR
{
"message": "Email tidak boleh null"
}
OR
{
"message": "Email tidak boleh kosong"
}
OR
{
"message": "Email must be unique"
}
OR
{
"message": "Password tidak boleh null"
}
OR
{
"message": "Password tidak boleh kosong"
}

2. POST /login
   Request:

body:

{
"email": "string",
"password": "string"
}

Response (200 - OK)
{
"access_token": "string"
}

Response (400 - Bad Request)
{
"message": "Email tidak boleh null"
}
OR
{
"message": "Password tidak boleh null"
}

Response (401 - Unauthorized)
{
"message": "Invalid email/password"
}

3. POST /login/google
   Request:

body:

{
"token": "string"
}

Response (200 - OK)
{
"access_token": "string"
}

Response (400 - Bad Request)
{
"message": "Token tidak valid"
}

4. GET /public/devices
   Description:

Mendapatkan semua perangkat Xiaomi dari database tanpa autentikasi

Response (200 - OK)
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

5. GET /public/devices/:id
   Description:

Mendapatkan detail perangkat Xiaomi berdasarkan ID tanpa autentikasi

Request:

params:

{
"id": "integer"
}

Response (200 - OK)
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

Response (404 - Not Found)
{
"message": "Device not found"
}

6. GET /devices
   Description:

Mendapatkan semua perangkat Xiaomi dari database

Request:

headers:

{
"access_token": "string"
}

Response (200 - OK)
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

7. GET /devices/:id
   Description:

Mendapatkan detail perangkat Xiaomi berdasarkan ID

Request:

headers:

{
"access_token": "string"
}

params:

{
:id": "integer"
}

Response (200 - OK)
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

Response (404 - Not Found)
{
"message": "Device not found"
}

8. PUT /users/update
   Description:

Memperbarui informasi pengguna

Request:

headers:

{
"access_token": "string"
}

body:

{
"username": "string",
"email": "string"
}

Response (200 - OK)
{
"id": "integer",
"username": "string",
"email": "string"
}

Response (400 - Bad Request)
{
"message": "Username tidak boleh null"
}
OR
{
"message": "Email tidak boleh null"
}
OR
{
"message": "Email must be unique"
}

9. POST /favorites/:XiaomiDeviceId
   Description:

Menambahkan perangkat Xiaomi ke favorit pengguna

Request:

headers:

{
"access_token": "string"
}

params:

{
"XiaomiDeviceId": "integer"
}

Response (201 - Created)
{
"id": "integer",
"UserId": "integer",
"XiaomiDeviceId": "integer"
}

Response (404 - Not Found)
{
"message": "Device not found"
}

10. GET /favorites
    Description:

Mendapatkan daftar perangkat favorit pengguna

Request:

headers:

{
"access_token": "string"
}

Response (200 - OK)
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

11. DELETE /favorites/:XiaomiDeviceId
    Description:

Menghapus perangkat Xiaomi dari favorit pengguna

Request:

headers:

{
"access_token": "string"
}

params:

{
"XiaomiDeviceId": "integer"
}

Response (200 - OK)
{
"message": "Device removed from favorites"
}

Response (404 - Not Found)
{
"message": "Favorite not found"
}

Global Error
Response (401 - Unauthorized)
{
"message": "Invalid token"
}

Response (404 - Not Found)
{
"message": "User not found"
}
OR
{
"message": "Device not found"
}
OR
{
"message": "Favorite not found"
}

Response (500 - Internal Server Error)
{
"message": "Internal server error"
}
