/*
  # Update RLS policies for public access

  1. Changes
    - Modified RLS policies to allow public read access
    - Added policies for unauthenticated access to essential tables
    - Updated team and resource management policies

  2. Security
    - Maintains security while allowing necessary public access
    - Preserves write protection for sensitive operations
*/

-- Update RLS policies for disasters
DROP POLICY IF EXISTS "Public disasters are viewable by everyone" ON disasters;
CREATE POLICY "Allow public disaster viewing"
  ON disasters FOR SELECT
  USING (true);

-- Update RLS policies for resources
DROP POLICY IF EXISTS "Resources are viewable by authenticated users" ON resources;
CREATE POLICY "Allow public resource viewing"
  ON resources FOR SELECT
  USING (true);

-- Update RLS policies for teams
DROP POLICY IF EXISTS "Teams are viewable by authenticated users" ON teams;
CREATE POLICY "Allow public team viewing"
  ON teams FOR SELECT
  USING (true);

-- Update RLS policies for reports
DROP POLICY IF EXISTS "Reports are viewable by authenticated users" ON reports;
CREATE POLICY "Allow public report viewing"
  ON reports FOR SELECT
  USING (true);

CREATE POLICY "Allow public report creation"
  ON reports FOR INSERT
  WITH CHECK (true);

-- Update RLS policies for alerts
DROP POLICY IF EXISTS "Alerts are viewable by everyone" ON alerts;
CREATE POLICY "Allow public alert viewing"
  ON alerts FOR SELECT
  USING (true);