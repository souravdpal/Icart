-- products.sql : table structure + seed data (50 rows)
BEGIN;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id                VARCHAR(20)   PRIMARY KEY,
    title             VARCHAR(255)  NOT NULL,
    description       TEXT,
    category          VARCHAR(100)  NOT NULL,
    brand             VARCHAR(100)  NOT NULL,
    price             INTEGER       NOT NULL CHECK (price >= 0),
    original_price    INTEGER       NOT NULL CHECK (original_price >= 0),
    discount_percent  SMALLINT      NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
    rating            NUMERIC(2,1)  CHECK (rating BETWEEN 0 AND 5),
    review_count      INTEGER       NOT NULL DEFAULT 0,
    tag               VARCHAR(30),
    is_new            BOOLEAN       NOT NULL DEFAULT FALSE,
    stock             INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image             TEXT,
    affiliate_url     TEXT,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
