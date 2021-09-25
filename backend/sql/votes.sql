CREATE TABLE IF NOT EXISTS Votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    complaint_id INT NOT NULL,
    FOREIGN KEY(user_id)
        REFERENCES users(id) ON DELETE CASCADE ,
    FOREIGN KEY(complaint_id)
        REFERENCES complaints(id) ON DELETE CASCADE
);
