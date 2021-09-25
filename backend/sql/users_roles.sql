CREATE TABLE IF NOT EXISTS Users_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY(user_id)
        REFERENCES users(id)  ON DELETE CASCADE ,
    FOREIGN KEY(role_id)
        REFERENCES roles(id) ON DELETE CASCADE 
);

INSERT INTO Users_roles(user_id, role_id) VALUES (1,2);
INSERT INTO Users_roles(user_id, role_id) VALUES (2,3);
INSERT INTO Users_roles(user_id, role_id) VALUES (3,3);
INSERT INTO Users_roles(user_id, role_id) VALUES (8,4);

