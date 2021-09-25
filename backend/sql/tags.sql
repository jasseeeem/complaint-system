CREATE TABLE IF NOT EXISTS Tags (
    id SERIAL PRIMARY KEY,
    tags VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS Tags_complaints (
    tag_id INT NOT NULL,
    complaints_id INT NOT NULL,
    PRIMARY KEY(tag_id, complaints_id),
    FOREIGN KEY(tag_id)
      REFERENCES Tags(id),
    FOREIGN KEY(complaints_id)
      REFERENCES Complaints(id)
);