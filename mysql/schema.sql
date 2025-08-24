-- Table: dealers
CREATE TABLE IF NOT EXISTS dealers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: service_schedules
CREATE TABLE IF NOT EXISTS service_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    schedule_date DATE NOT NULL,
    quota INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: service_statuses
CREATE TABLE IF NOT EXISTS service_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Table: service_bookings
CREATE TABLE IF NOT EXISTS service_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    vehicle_problem TEXT NOT NULL,
    service_schedule_id INT NOT NULL,
    service_time VARCHAR(10) NOT NULL,
    service_status_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_schedule_id) REFERENCES service_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (service_status_id) REFERENCES service_statuses(id) ON DELETE RESTRICT,
    INDEX idx_customer_phone (phone_no),
    INDEX idx_status (service_status_id)
);

-- Input Default Statuses
INSERT INTO service_statuses (name) VALUES
('menunggu konfirmasi'),
('konfirmasi batal'),
('konfirmasi datang'),
('tidak datang'),
('datang');