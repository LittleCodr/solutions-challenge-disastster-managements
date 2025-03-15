/*
  # Update RLS policies for public access

  1. Changes
    - Allow public access to create reports
    - Allow public access to create and update resources
    - Allow public access to create alerts
    - Remove authentication requirements for data modifications

  2. Security Note
    - This is a development/demo configuration
    - For production, proper authentication should be implemented
*/

-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Only authorized personnel can manage resources" ON resources;
DROP POLICY IF EXISTS "Only authorized personnel can manage alerts" ON alerts;
DROP POLICY IF EXISTS "Anyone can create reports" ON reports;

-- Create new policies for public access
CREATE POLICY "Allow public resource management"
  ON resources FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public alert management"
  ON alerts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public report management"
  ON reports FOR ALL
  USING (true)
  WITH CHECK (true);