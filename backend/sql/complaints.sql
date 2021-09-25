CREATE TABLE IF NOT EXISTS Complaints (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    image BYTEA,
    user_id INT NOT NULL,    --For the user created 
    FOREIGN KEY(user_id)
        REFERENCES users(id) ON CASCADE DELETE 
);

