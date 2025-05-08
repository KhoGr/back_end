-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS mini_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sử dụng database vừa tạo
USE mini_ecommerce;

-- Bảng Accounts
CREATE TABLE Accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255),
  google_id VARCHAR(100) UNIQUE,
  google_token VARCHAR(255),
  facebook_id VARCHAR(100) UNIQUE,
  facebook_token VARCHAR(255),
  provider ENUM('google', 'facebook', 'local') DEFAULT 'local',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Users
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  avatar VARCHAR(255),
  phone VARCHAR(15) UNIQUE,
  address TEXT,
  role ENUM('admin', 'customer', 'seller') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES Accounts(id) ON DELETE CASCADE
);

-- Bảng Staffs
CREATE TABLE Staffs (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  position VARCHAR(100),
  salary DECIMAL(10, 2),
  working_type ENUM('fulltime', 'parttime') DEFAULT 'fulltime',
  joined_date DATE,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Bảng Customers
CREATE TABLE Customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  loyalty_point INT DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0.00,
  membership_level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
