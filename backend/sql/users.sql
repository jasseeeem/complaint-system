CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    regNo VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL
);

INSERT INTO Users(name,regNo,password) VALUES ('jaseem','B190768CS','XAE11C');
INSERT INTO Users(name,regNo,password) VALUES ('akshay','B190748CS','23E11C');
INSERT INTO Users(name,regNo,password) VALUES ('varghese','B190708CS','23E43C');
INSERT INTO Users(name,regNo,password) VALUES ('Sanjay','M120781MA','23ETYC');
