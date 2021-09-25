CREATE TABLE IF NOT EXISTS Complaints (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    image VARCHAR(100),
    user_id INT NOT NULL,    --For the user created 
    hostel_id INT NOT NULL,
    room_no INT,
    votes INT DEFAULT 0,
    set_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hostel_id)
       REFERENCES hostels(id) ON DELETE CASCADE, 
    FOREIGN KEY(user_id)
        REFERENCES users(id) ON DELETE CASCADE 
);


