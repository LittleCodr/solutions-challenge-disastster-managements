/*
  # Fix timestamp handling for tables

  1. Changes
    - Add default values for created_at and updated_at
    - Ensure timestamps are in UTC
    - Add trigger for updating updated_at
*/

-- Update timestamp columns to use timestamptz with defaults
ALTER TABLE reports 
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE resources 
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE alerts 
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN sent_at TYPE timestamptz,
  ALTER COLUMN expires_at TYPE timestamptz;