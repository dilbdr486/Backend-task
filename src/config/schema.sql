-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make_name VARCHAR(255) NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    trim_name VARCHAR(255),
    trim_description TEXT,
    engine_type VARCHAR(255),
    engine_fuel_type VARCHAR(255),
    engine_cylinders INT,
    engine_size DECIMAL(10, 2),
    engine_horsepower_hp INT,
    engine_horsepower_rpm INT,
    engine_drive_type VARCHAR(255),
    body_type VARCHAR(255),
    body_doors INT,
    body_seats INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

