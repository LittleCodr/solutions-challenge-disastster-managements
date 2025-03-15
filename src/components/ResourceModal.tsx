import React, { useState } from 'react';
import { X, Box } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';

type ResourceInsert = Database['public']['Tables']['resources']['Insert'];

interface ResourceModalProps {
  onClose: () => void;
}

export default function ResourceModal({ onClose }: ResourceModalProps) {
  const { createResource } = useDisasterStore();
  const [formData, setFormData] = useState<Partial<ResourceInsert>>({
    type: 'medical',
    name: '',
    description: '',
    quantity: 0,
    unit: 'units',
    location_name: '',
    status: 'available',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!formData.location?.coordinates[0] || !formData.location?.coordinates[1]) {
        throw new Error('Please provide valid coordinates');
      }

      await createResource(formData as ResourceInsert);
      onClose();
    } catch (error) {
      console.error('Failed to add resource:', error);
      setError(error instanceof Error ? error.message : 'Failed to add resource');
    }
  };

  const handleCoordinateChange = (type: 'longitude' | 'latitude', value: string) => {
    const numValue = Number(value);
    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: type === 'longitude' 
          ? [numValue, prev.location?.coordinates[1] || 0]
          : [prev.location?.coordinates[0] || 0, numValue]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Box className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Add Resource</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Resource Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceInsert['type'] })}
            >
              <option value="medical">Medical Supplies</option>
              <option value="food">Food</option>
              <option value="water">Water</option>
              <option value="shelter">Shelter</option>
              <option value="rescue">Rescue Equipment</option>
              <option value="transport">Transportation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Emergency Medical Kit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the resource"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., units, boxes, liters"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                value={formData.location?.coordinates[0] || ''}
                onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                placeholder="-180 to 180"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                value={formData.location?.coordinates[1] || ''}
                onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                placeholder="-90 to 90"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              placeholder="e.g., Central Warehouse"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ResourceInsert['status'] })}
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="in-transit">In Transit</option>
              <option value="deployed">Deployed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}