CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    regNo VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    contact VARCHAR(30)
);


