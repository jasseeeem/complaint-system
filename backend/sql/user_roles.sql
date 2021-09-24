CREATE TABLE IF NOT EXISTS User_roles (
    user_id INT NOT NULL,
    roles_id INT NOT NULL,
    PRIMARY KEY (user_id, roles_id),
    FOREIGN KEY(user_id)
        REFERENCES users(id),
    FOREIGN KEY(roles_id)
        REFERENCES roles(id)
);

INSERT INTO User_roles(user_id, roles_id) VALUES (1,2);
INSERT INTO User_roles(user_id, roles_id) VALUES (2,3);
INSERT INTO User_roles(user_id, roles_id) VALUES (3,3);
INSERT INTO User_roles(user_id, roles_id) VALUES (8,4);

