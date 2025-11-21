-- Rename table to match Hibernate naming
RENAME TABLE InvalidatedToken TO invalidated_token;

-- Modify id to VARCHAR
ALTER TABLE invalidated_token
MODIFY COLUMN id VARCHAR(255);

-- If account_id references Account(account_id)
ALTER TABLE invalidated_token
MODIFY COLUMN account_id INT NOT NULL;
