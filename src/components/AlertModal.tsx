import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import type { Database } from '../lib/database.types';

type AlertInsert = Database['public']['Tables']['alerts']['Insert'];

interface AlertModalProps {
  onClose: () => void;
  disasterId?: string;
}

export default function AlertModal({ onClose, disasterId }: AlertModalProps) {
  const { broadcastAlert } = useDisasterStore();
  const [formData, setFormData] = useState<Partial<AlertInsert>>({
    type: 'warning',
    title: '',
    message: '',
    severity: 3,
    channels: ['sms', 'email', 'app'],
    status: 'draft',
    affected_area: {
      type: 'Polygon',
      coordinates: [[
        [-122.33, 47.61],
        [-122.33, 47.62],
        [-122.32, 47.62],
        [-122.32, 47.61],
        [-122.33, 47.61]
      ]]
    },
    disaster_id: disasterId
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await broadcastAlert({
        ...formData,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Failed to broadcast alert:', error);
      setError(error instanceof Error ? error.message : 'Failed to broadcast alert');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Broadcast Alert</h2>
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
            <label className="block text-sm font-medium text-gray-700">Alert Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AlertInsert['type'] })}
            >
              <option value="warning">Warning</option>
              <option value="evacuation">Evacuation Order</option>
              <option value="update">Status Update</option>
              <option value="all-clear">All Clear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief alert title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Detailed alert message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Severity (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              className="mt-1 block w-full"
              value={formData.severity || 3}
              onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Advisory (1)</span>
              <span>Warning (3)</span>
              <span>Critical (5)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Distribution Channels</label>
            <div className="mt-2 space-y-2">
              {['sms', 'email', 'app', 'emergency-broadcast', 'social-media'].map(channel => (
                <label key={channel} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    checked={formData.channels?.includes(channel)}
                    onChange={(e) => {
                      const channels = formData.channels || [];
                      setFormData({
                        ...formData,
                        channels: e.target.checked
                          ? [...channels, channel]
                          : channels.filter(c => c !== channel)
                      });
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{channel.replace('-', ' ')}</span>
                </label>
              ))}
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
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Broadcast Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

