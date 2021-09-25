CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    regNo VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);

INSERT INTO Users(name,rollNo,password) VALUES ('jaseem','B190768CS','XAE11C');
INSERT INTO Users(name,rollNo,password) VALUES ('akshay','B190748CS','23E11C');
INSERT INTO Users(name,rollNo,password) VALUES ('varghese','B190708CS','23E43C');
INSERT INTO Users(name,rollNo,password) VALUES ('Sanjay','M120781MA','23ETYC');
