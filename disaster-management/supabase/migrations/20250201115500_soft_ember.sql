/*
  # Initial Schema for Disaster Response Hub

  1. New Tables
    - `disasters`
      - Real-time disaster tracking
      - Severity levels and impact metrics
    - `resources`
      - Emergency resource inventory
      - Location and status tracking
    - `teams`
      - Emergency response teams
      - Real-time deployment status
    - `reports`
      - Crowdsourced disaster reports
      - Geo-tagged incident reporting
    - `alerts`
      - Emergency broadcast system
      - Multi-channel notifications

  2. Security
    - RLS policies for each table
    - Role-based access control
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Disasters Table
CREATE TABLE IF NOT EXISTS disasters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('earthquake', 'flood', 'hurricane', 'wildfire', 'tsunami', 'tornado')),
  severity integer NOT NULL CHECK (severity BETWEEN 1 AND 5),
  title text NOT NULL,
  description text,
  location geography(POINT, 4326) NOT NULL,
  location_name text NOT NULL,
  affected_radius_km numeric NOT NULL,
  affected_population integer,
  status text NOT NULL CHECK (status IN ('monitoring', 'active', 'responding', 'recovery')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  predicted_path geography(LINESTRING, 4326),
  weather_conditions jsonb,
  evacuation_zones geography(POLYGON, 4326)[]
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('medical', 'food', 'water', 'shelter', 'rescue', 'transport')),
  name text NOT NULL,
  description text,
  quantity integer NOT NULL,
  unit text NOT NULL,
  location geography(POINT, 4326) NOT NULL,
  location_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'reserved', 'in-transit', 'deployed')),
  assigned_to uuid REFERENCES disasters(id),
  expiry_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  tracking_data jsonb
);

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('medical', 'rescue', 'firefighting', 'police', 'engineering')),
  capacity integer NOT NULL,
  current_members integer NOT NULL,
  location geography(POINT, 4326) NOT NULL,
  location_name text NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'responding', 'on-site', 'resting')),
  assigned_to uuid REFERENCES disasters(id),
  specializations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  disaster_id uuid REFERENCES disasters(id),
  type text NOT NULL CHECK (type IN ('incident', 'damage', 'rescue-needed', 'update')),
  title text NOT NULL,
  description text NOT NULL,
  location geography(POINT, 4326) NOT NULL,
  location_name text NOT NULL,
  severity integer CHECK (severity BETWEEN 1 AND 5),
  status text NOT NULL CHECK (status IN ('pending', 'verified', 'resolved', 'false-alarm')),
  images text[],
  reporter_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  verified_by uuid REFERENCES auth.users(id)
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  disaster_id uuid REFERENCES disasters(id),
  type text NOT NULL CHECK (type IN ('warning', 'evacuation', 'update', 'all-clear')),
  title text NOT NULL,
  message text NOT NULL,
  severity integer CHECK (severity BETWEEN 1 AND 5),
  affected_area geography(POLYGON, 4326) NOT NULL,
  channels text[] NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'sent', 'delivered', 'expired')),
  sent_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE disasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public disasters are viewable by everyone"
  ON disasters FOR SELECT
  USING (true);

CREATE POLICY "Only authorized personnel can manage disasters"
  ON disasters FOR ALL
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() LIKE '%@emergency.gov'
  ));

CREATE POLICY "Resources are viewable by authenticated users"
  ON resources FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authorized personnel can manage resources"
  ON resources FOR ALL
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() LIKE '%@emergency.gov'
  ));

CREATE POLICY "Teams are viewable by authenticated users"
  ON teams FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only team leaders can manage teams"
  ON teams FOR ALL
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() LIKE '%@emergency.gov'
  ));

CREATE POLICY "Reports are viewable by authenticated users"
  ON reports FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Report owners can update their reports"
  ON reports FOR UPDATE
  USING (auth.uid() = reporter_id);

CREATE POLICY "Alerts are viewable by everyone"
  ON alerts FOR SELECT
  USING (true);

CREATE POLICY "Only authorized personnel can manage alerts"
  ON alerts FOR ALL
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() LIKE '%@emergency.gov'
  ));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX IF NOT EXISTS resources_location_idx ON resources USING GIST (location);
CREATE INDEX IF NOT EXISTS teams_location_idx ON teams USING GIST (location);
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);
CREATE INDEX IF NOT EXISTS alerts_affected_area_idx ON alerts USING GIST (affected_area);

-- Create functions for real-time features
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER disasters_updated_at
  BEFORE UPDATE ON disasters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();