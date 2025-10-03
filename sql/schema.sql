CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  author_text text,
  description text,
  language text,
  visibility text NOT NULL DEFAULT 'public',
  storage_path text NOT NULL,
  mime text,
  pages int,
  thumbnail_path text,
  extracted_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS document_tags (
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  tag_id int REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id),
  original_filename text,
  size_bytes bigint,
  status text NOT NULL DEFAULT 'processing',
  uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS views (
  id bigserial PRIMARY KEY,
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid,
  ip inet,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  reporter_id uuid,
  reason text,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);
