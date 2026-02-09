BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 0001

CREATE TABLE collections (
    id UUID NOT NULL, 
    name VARCHAR NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_collections_name ON collections (name);

INSERT INTO alembic_version (version_num) VALUES ('0001') RETURNING alembic_version.version_num;

COMMIT;
