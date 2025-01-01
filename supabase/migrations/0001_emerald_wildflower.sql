/*
  # Create RPM Data Table
  
  1. New Tables
    - `rpm_data`
      - `id` (uuid, primary key) - matches auth.users.id
      - `data` (jsonb) - stores RPM data
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policy for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS rpm_data (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rpm_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own data"
  ON rpm_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
