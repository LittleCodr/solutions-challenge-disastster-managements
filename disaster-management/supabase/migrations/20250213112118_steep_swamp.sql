/*
  # Add sample disaster response data for India

  1. Sample Data
    - Active disasters in various Indian states
    - Emergency response resources
    - Response teams
    - Recent alerts
*/

-- Sample Disasters
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

-- Sample Resources
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
  ),
  (
    'rescue', 'Water Rescue Equipment',
    'Boats and water rescue gear',
    20, 'units',
    ST_SetSRID(ST_MakePoint(76.2711, 10.8505), 4326),
    'Kerala State Emergency Response Depot',
    'deployed'
  );

-- Sample Teams
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
  ),
  (
    'Gujarat Search & Rescue',
    'rescue',
    40, 35,
    ST_SetSRID(ST_MakePoint(70.2196, 23.2420), 4326),
    'Bhuj Response Center',
    'responding',
    ARRAY['urban_rescue', 'structural_assessment', 'heavy_equipment']
  );

-- Sample Alerts
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
    NOW()
  ),
  (
    'evacuation',
    'Cyclone Warning: Immediate Evacuation',
    'Severe cyclonic storm approaching Chennai coast. Mandatory evacuation for coastal areas.',
    5,
    ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(80.2 13.0, 80.4 13.0, 80.4 13.2, 80.2 13.2, 80.2 13.0)')), 4326),
    ARRAY['sms', 'emergency-broadcast', 'social-media'],
    'sent',
    NOW()
  ),
  (
    'update',
    'Bhuj Earthquake Update',
    'Moderate earthquake recorded in Kutch region. Emergency services deployed. Stay in open areas.',
    3,
    ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(70.1 23.1, 70.3 23.1, 70.3 23.3, 70.1 23.3, 70.1 23.1)')), 4326),
    ARRAY['sms', 'app'],
    'sent',
    NOW()
  );