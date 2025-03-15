/*
  # Restore Complete Database Schema

  1. Tables
    - disasters: Track active disasters and their details
    - resources: Manage emergency resources and supplies
    - teams: Emergency response teams tracking
    - reports: Incident reporting system
    - alerts: Emergency broadcast system

  2. Security
    - Public access policies for demo
    - Geographic data support
    - Automatic timestamp handling
*/

-- Enable PostGIS for geographic data
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
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
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
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
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
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  last_active timestamptz DEFAULT CURRENT_TIMESTAMP
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
  reporter_id uuid,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  verified_by uuid
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
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  created_by uuid
);

-- Enable RLS
ALTER TABLE disasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create public access policies
CREATE POLICY "Allow public access to disasters"
  ON disasters FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to resources"
  ON resources FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to teams"
  ON teams FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to reports"
  ON reports FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to alerts"
  ON alerts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX IF NOT EXISTS resources_location_idx ON resources USING GIST (location);
CREATE INDEX IF NOT EXISTS teams_location_idx ON teams USING GIST (location);
CREATE INDEX IF NOT EXISTS reports_location_idx ON reports USING GIST (location);
CREATE INDEX IF NOT EXISTS alerts_affected_area_idx ON alerts USING GIST (affected_area);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON disasters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert sample data
INSERT INTO disasters (
  type, severity, title, description, location, location_name,
  affected_radius_km, affected_population, status, weather_conditions
) VALUES
  (
    'flood', 4, 'Kerala Monsoon Flooding',
    'Severe flooding in Kerala due to intense monsoon rainfall',
    ST_SetSRID(ST_MakePoint(76.2711, 10.8505), 4326),
    'Kochi, Kerala',
    50, 150000, 'active',
    '{"rainfall_mm": 350, "wind_speed_kmh": 45, "humidity": 95}'
  ),
  (
    'tornado', 5, 'Severe Cyclonic Storm',
    'Category 5 cyclonic storm approaching Tamil Nadu coast',
    ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326),
    'Chennai, Tamil Nadu',
    100, 500000, 'active',
    '{"wind_speed_kmh": 180, "pressure_mb": 950, "storm_surge_m": 4}'
  ),
  (
    'earthquake', 3, 'Gujarat Seismic Activity',
    'Moderate earthquake in Kutch region',
    ST_SetSRID(ST_MakePoint(70.2196, 23.2420), 4326),
    'Bhuj, Gujarat',
    30, 75000, 'active',
    '{"magnitude": 5.8, "depth_km": 10, "aftershocks": true}'
  );

INSERT INTO resources (
  type, name, description, quantity, unit,
  location, location_name, status
) VALUES
  (
    'medical', 'Emergency Medical Camp',
    'Fully equipped medical camp with trauma care facilities',
    50, 'beds',
    ST_SetSRID(ST_MakePoint(76.2711, 10.8505), 4326),
    'Ernakulam Medical Center',
    'deployed'
  ),
  (
    'food', 'Relief Food Supplies',
    'Emergency food and water supplies',
    10000, 'meals',
    ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326),
    'Chennai Central Warehouse',
    'available'
  ),
  (
    'shelter', 'Emergency Shelter Kits',
    'Temporary shelter materials and basic amenities',
    500, 'kits',
    ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326),
    'Mumbai Disaster Response Center',
    'available'
  );

INSERT INTO teams (
  name, type, capacity, current_members,
  location, location_name, status, specializations
) VALUES
  (
    'Kerala Rapid Response Team',
    'rescue',
    50, 45,
    ST_SetSRID(ST_MakePoint(76.2711, 10.8505), 4326),
    'Kochi Emergency Center',
    'responding',
    ARRAY['water_rescue', 'medical_first_response', 'evacuation']
  ),
  (
    'Tamil Nadu Medical Corps',
    'medical',
    30, 28,
    ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326),
    'Chennai General Hospital',
    'available',
    ARRAY['trauma_care', 'emergency_medicine', 'public_health']
  );

INSERT INTO alerts (
  type, title, message, severity,
  affected_area, channels, status, sent_at
) VALUES
  (
    'warning',
    'Urgent: Kerala Flood Warning',
    'Severe flooding expected in Ernakulam district. Please evacuate to designated centers immediately.',
    4,
    ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(76.2 10.8, 76.4 10.8, 76.4 11.0, 76.2 11.0, 76.2 10.8)')), 4326),
    ARRAY['sms', 'email', 'emergency-broadcast'],
    'sent',
    CURRENT_TIMESTAMP
  ),
  (
    'evacuation',
    'Cyclone Warning: Immediate Evacuation',
    'Severe cyclonic storm approaching Chennai coast. Mandatory evacuation for coastal areas.',
    5,
    ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(80.2 13.0, 80.4 13.0, 80.4 13.2, 80.2 13.2, 80.2 13.0)')), 4326),
    ARRAY['sms', 'emergency-broadcast', 'social-media'],
    'sent',
    CURRENT_TIMESTAMP
  );