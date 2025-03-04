# Hướng dẫn tạo và quản lý database bằng Sequelize

Đây là hướng dẫn ngắn gọn để thiết lập và quản lý cơ sở dữ liệu MySQL bằng cách sử dụng Sequelize.

---

## **Yêu cầu**

1. **Node.js**: Đảm bảo đã cài đặt Node.js trên máy.
2. **Sequelize CLI**: Cài đặt Sequelize CLI bằng lệnh:
   ```bash
   npm install -g sequelize-cli
   ```
3. **MySQL**: Đảm bảo MySQL đã được cài đặt và chạy.

---

## **Các bước cài đặt và tạo database**

### 1. Tạo file cấu hình Sequelize

Tạo file `config/config.json` trong thư mục dự án với nội dung như sau:

```json
{
  "development": {
    "username": "root",
    "password": "yourpassword",
    "database": "yourdatabase",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "yourpassword",
    "database": "test_database",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "yourpassword",
    "database": "production_database",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```
> **Lưu ý:** Thay thế `yourpassword` và `yourdatabase` bằng thông tin của bạn.

### 2. Tạo cơ sở dữ liệu trong MySQL

Sử dụng câu lệnh dưới đây để tạo cơ sở dữ liệu:

```sql
CREATE DATABASE yourdatabase;
```
> **Lưu ý:** Đảm bảo tên database trong MySQL trùng khớp với tên trong file cấu hình `config/config.json`.

---

## **Các bước migrate database**

### 1. Khởi tạo Sequelize trong dự án

Chạy lệnh sau để khởi tạo Sequelize:
```bash
npx sequelize init
```

Lệnh này sẽ tạo các thư mục mặc định: `models`, `migrations`, và `seeders`.

### 2. Tạo file migration

Tạo các file migration cho bảng `Accounts` và `Users`:
```bash
npx sequelize migration:generate --name create-accounts-table
npx sequelize migration:generate --name create-users-table
```

### 3. Chạy migration

Chạy lệnh migrate để áp dụng các thay đổi:
```bash
npx sequelize db:migrate
```

Sau khi thực hiện lệnh này, các bảng sẽ được tạo trong cơ sở dữ liệu theo cấu trúc được định nghĩa trong file migration.

---

**Hoàn thành!** Bây giờ cơ sở dữ liệu đã được thiết lập với các bảng ban đầu. Nếu bạn cần seed dữ liệu hoặc rollback migration, hãy tiếp tục thêm các bước chi tiết.

