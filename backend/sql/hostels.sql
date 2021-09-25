CREATE TABLE IF NOT EXISTS Hostels (
    id SERIAL PRIMARY KEY,
    hostel_name VARCHAR(50) NOT NULL,
    warden_id INT NOT NULL,
    FOREIGN KEY(warden_id)
      REFERENCES users(id) ON DELETE CASCADE
);

