export interface DisasterAlert {
  id: string;
  type: 'earthquake' | 'flood' | 'hurricane' | 'wildfire';
  severity: 1 | 2 | 3 | 4 | 5;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  timestamp: string;
  affectedPopulation: number;
  status: 'monitoring' | 'active' | 'responding' | 'recovery';
}

export interface ResourceUnit {
  id: string;
  type: 'medical' | 'food' | 'shelter' | 'rescue';
  name: string;
  quantity: number;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  status: 'available' | 'in-transit' | 'deployed';
}

export interface EmergencyTeam {
  id: string;
  name: string;
  type: 'medical' | 'rescue' | 'firefighting' | 'police';
  members: number;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  status: 'available' | 'responding' | 'on-site';
}