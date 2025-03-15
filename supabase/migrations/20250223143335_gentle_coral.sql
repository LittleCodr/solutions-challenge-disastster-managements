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