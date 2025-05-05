# IP-RMT60: Xiaomi Devices API Documentation

This document provides comprehensive details for the server-side API of the Xiaomi Devices platform, built with Express.js, Sequelize, and PostgreSQL. The API facilitates user authentication, device exploration, and management of favorite devices.

---

## Table of Contents

1. [Models](#models)
2. [Relationships](#relationships)
3. [Available Endpoints](#available-endpoints)
4. [Public Endpoints](#public-endpoints)
5. [Authenticated Endpoints](#authenticated-endpoints)
6. [Global Error Handling](#global-error-handling)

---

## Models

### User

Represents a registered user of the platform.

| Field    | Type   | Constraints      |
| -------- | ------ | ---------------- |
| username | String | Required         |
| email    | String | Required, Unique |
| password | String | Required         |

### XiaomiDevice

Represents a Xiaomi device available on the platform.

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

Represents a user’s favorite Xiaomi device.

| Field          | Type    | Constraints |
| -------------- | ------- | ----------- |
| UserId         | Integer | Required    |
| XiaomiDeviceId | Integer | Required    |

---

## Relationships

- **Many-to-Many**: The `User` and `XiaomiDevice` models are connected through the `Favorite` model using Sequelize's many-to-many relationship.

---

## Available Endpoints

### Public Endpoints

- `POST /register` - Create a new user account
- `POST /login` - Authenticate a user and return an access token
- `POST /login/google` - Authenticate a user via Google OAuth
- `GET /public/devices` - Retrieve all Xiaomi devices
- `GET /public/devices/:id` - Retrieve a specific Xiaomi device by ID

### Authenticated Endpoints

- `GET /devices` - Retrieve all Xiaomi devices (authenticated)
- `GET /devices/:id` - Retrieve a specific Xiaomi device by ID (authenticated)
- `PUT /users/update` - Update user information
- `POST /favorites/:XiaomiDeviceId` - Add a Xiaomi device to user’s favorites
- `GET /favorites` - Retrieve user’s favorite devices
- `DELETE /favorites/:XiaomiDeviceId` - Remove a Xiaomi device from user’s favorites

---

## Public Endpoints

### 1. POST /register

**Description**: Creates a new user account.

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

_Or similar validation errors for username, email, or password._

**Response (400 - Bad Request)**:

```json
{
  "message": "Email must be unique"
}
```

---

### 2. POST /login

**Description**: Authenticates a user and returns an access token.

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

_Or_:

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

**Description**: Authenticates a user via Google OAuth and returns an access token.

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

**Description**: Retrieves all Xiaomi devices available on the platform.

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
    "chip

set": "Snapdragon 8 Gen 3",
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

**Description**: Retrieves details of a specific Xiaomi device by its ID.

**Parameters**:

- `id` (required): Device ID (integer)

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

## Authenticated Endpoints

All endpoints below require an `Authorization` header with a Bearer token obtained from the `/login` or `/login/google` endpoint.

**Headers**:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

### 6. GET /devices

**Description**: Retrieves all Xiaomi devices for authenticated users.

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

**Description**: Retrieves details of a specific Xiaomi device by its ID for authenticated users.

**Parameters**:

- `id` (required): Device ID (integer)

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

**Description**: Updates the authenticated user’s information.

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

_Or_:

```json
{
  "message": "Email tidak boleh null"
}
```

_Or_:

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

**Description**: Adds a Xiaomi device to the authenticated user’s favorites.

**Parameters**:

- `XiaomiDeviceId` (required): Device ID (integer)

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

**Description**: Retrieves the authenticated user’s favorite devices.

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

**Description**: Removes a Xiaomi device from the authenticated user’s favorites.

**Parameters**:

- `XiaomiDeviceId` (required): Device ID (integer)

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

## Global Error Handling

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

_Or_:

```json
{
  "message": "Device not found"
}
```

_Or_:

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

This API documentation provides clear guidance for developers interacting with the Xiaomi Devices platform. For further details, refer to the source code or contact the development team.
