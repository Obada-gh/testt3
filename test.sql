DROP TABLE IF EXISTS digimon;

CREATE TABLE IF NOT EXISTS digimon (

    id SERIAL PRIMARY KEY,
    name varchar(255),
    img varchar(255),
    level varchar(255)
    
);