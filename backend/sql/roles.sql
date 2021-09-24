CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO Roles(name) VALUES ('collector');
INSERT INTO Roles(name) VALUES ('Admin');
INSERT INTO Roles(name) VALUES ('Student');
INSERT INTO Roles(name) VALUES ('Faculty');
