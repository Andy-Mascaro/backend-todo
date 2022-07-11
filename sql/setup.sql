DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL
);

CREATE TABLE todos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id BIGINT NOT NULL,
    description VARCHAR NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT(false)

);

-- INSERT INTO todos( client_id, description)

-- VALUES ('8', 'workout');
