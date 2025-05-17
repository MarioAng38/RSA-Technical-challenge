CREATE DATABASE IF NOT EXISTS event_db;
USE event_db;

-- Tabel Users
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    date_of_birth DATE,
    role ENUM('Utilizator', 'Organizator') DEFAULT 'Utilizator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Events
CREATE TABLE Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255),
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

CREATE TABLE Organizers (
    event_id INT,
    user_id INT,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Tabel Sessions
CREATE TABLE Sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    speaker VARCHAR(255),
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

-- Tabel Registrations
CREATE TABLE Registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (session_id) REFERENCES Sessions(session_id),
    UNIQUE (user_id, session_id)
);

-- Tabel Feedback
CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (session_id) REFERENCES Sessions(session_id),
    UNIQUE (user_id, session_id)
);

DELIMITER $$

CREATE TRIGGER trg_check_feedback_registration
BEFORE INSERT ON Feedback
FOR EACH ROW
BEGIN
    DECLARE reg_count INT;

    SELECT COUNT(*) INTO reg_count
    FROM Registrations
    WHERE user_id = NEW.user_id AND session_id = NEW.session_id;

    IF reg_count = 0 THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Utilizatorul nu poate lasa feedback fara sa fie inregistrat in sesiune!';
        END IF;
    END $$

DELIMITER ;