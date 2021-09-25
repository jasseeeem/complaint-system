CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO Roles(name) VALUES ('warden');
INSERT INTO Roles(name) VALUES ('student');
INSERT INTO Roles(name) VALUES ('faculty');
-- INSERT INTO Roles(name) VALUES ('Faculty');
