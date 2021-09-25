CREATE TABLE IF NOT EXISTS Votes (
    user_id INT NOT NULL,
    complaints_id INT NOT NULL,
    PRIMARY KEY (user_id, complaints_id),
    FOREIGN KEY(user_id)
        REFERENCES users(id) ON CASCADE DELETE,
    FOREIGN KEY(complaints_id)
        REFERENCES complaints(id) ON CASCADE DELETE
);
