import { DisasterAlert, ResourceUnit, EmergencyTeam } from '../types';

export const mockAlerts: DisasterAlert[] = [
  {
    id: '1',
    type: 'earthquake',
    severity: 4,
    location: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Los Angeles, CA'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    affectedPopulation: 50000,
    status: 'active'
  },
  {
    id: '2',
    type: 'hurricane',
    severity: 5,
    location: {
      lat: 25.7617,
      lng: -80.1918,
      name: 'Miami, FL'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    affectedPopulation: 100000,
    status: 'monitoring'
  },
  {
    id: '3',
    type: 'wildfire',
    severity: 3,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      name: 'San Francisco, CA'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    affectedPopulation: 25000,
    status: 'responding'
  }
];

export const mockResources: ResourceUnit[] = [
  {
    id: '1',
    type: 'medical',
    name: 'Emergency Medical Supplies',
    quantity: 1000,
    location: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'LA Medical Center'
    },
    status: 'available'
  },
  {
    id: '2',
    type: 'food',
    name: 'Emergency Food Supplies',
    quantity: 5000,
    location: {
      lat: 25.7617,
      lng: -80.1918,
      name: 'Miami Distribution Center'
    },
    status: 'in-transit'
  }
];

export const mockTeams: EmergencyTeam[] = [
  {
    id: '1',
    name: 'Alpha Rescue Team',
    type: 'rescue',
    members: 12,
    location: {
      lat: 34.0522,
      lng: -118.2437,
      name: 'LA County'
    },
    status: 'responding'
  },
  {
    id: '2',
    name: 'Beta Medical Unit',
    type: 'medical',
    members: 8,
    location: {
      lat: 25.7617,
      lng: -80.1918,
      name: 'Miami-Dade'
    },
    status: 'available'
  }
];