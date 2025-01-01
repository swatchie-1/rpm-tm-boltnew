/*
  # Add scheduling table

  1. New Tables
    - `schedules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `item_id` (uuid)
      - `text` (text)
      - `scheduled_for` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `schedules` table
    - Add policy for authenticated users to manage their own schedules
*/

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  item_id uuid NOT NULL,
  text text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own schedules"
  ON schedules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
