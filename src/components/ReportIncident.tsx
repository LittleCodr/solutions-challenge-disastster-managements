import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';

type ReportInsert = Database['public']['Tables']['reports']['Insert'];

interface ReportIncidentProps {
  onClose: () => void;
}

export default function ReportIncident({ onClose }: ReportIncidentProps) {
  const { createReport } = useDisasterStore();
  const [formData, setFormData] = useState<Partial<ReportInsert>>({
    type: 'incident',
    title: '',
    description: '',
    location_name: '',
    severity: 3,
    status: 'pending',
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    images: []
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!formData.location?.coordinates[0] || !formData.location?.coordinates[1]) {
        throw new Error('Please provide valid coordinates');
      }

      await createReport({
        ...formData,
        status: 'pending',
        images: [],
        location: {
          type: 'Point',
          coordinates: [
            Number(formData.location.coordinates[0]),
            Number(formData.location.coordinates[1])
          ]
        }
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit report:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit report');
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
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Report Incident</h2>
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
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the incident"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the situation"
            />
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
              placeholder="e.g., Downtown Seattle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Severity (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              className="mt-1 block w-full"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minor (1)</span>
              <span>Moderate (3)</span>
              <span>Severe (5)</span>
            </div>
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
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}