BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 0001

CREATE TABLE threads (
    id UUID NOT NULL, 
    PRIMARY KEY (id)
);

INSERT INTO alembic_version (version_num) VALUES ('0001') RETURNING alembic_version.version_num;

-- Running upgrade 0001 -> 0002

CREATE TABLE runs (
    id UUID NOT NULL, 
    thread_id UUID NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(thread_id) REFERENCES threads (id) ON DELETE CASCADE
);

UPDATE alembic_version SET version_num='0002' WHERE alembic_version.version_num = '0001';

-- Running upgrade 0002 -> 0003

CREATE TABLE messages (
    id UUID NOT NULL, 
    run_id UUID NOT NULL, 
    role VARCHAR NOT NULL, 
    data JSONB, 
    meta JSONB, 
    PRIMARY KEY (id), 
    FOREIGN KEY(run_id) REFERENCES runs (id) ON DELETE CASCADE
);

UPDATE alembic_version SET version_num='0003' WHERE alembic_version.version_num = '0002';

COMMIT;
