CREATE TABLE IF NOT EXISTS Complaints (
    id SERIAL PRIMARY KEY,
    complaint VARCHAR(50) NOT NULL,
    image BYTEA,
    user_id INT NOT NULL,    --For the user created 
    FOREIGN KEY(user_id)
        REFERENCES users(id) 
);
