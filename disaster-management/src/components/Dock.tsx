import React, { useState } from 'react';
import { Map, Globe2, BarChart2, Users, Box, AlertTriangle, MessageSquare, Bot } from 'lucide-react';
import AIChat from './AIChat';

interface DockProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'deployed' | 'training';
  location: string;
}

interface ResourceItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  location: string;
  status: 'available' | 'in-use' | 'maintenance';
}

interface IncidentReport {
  id: string;
  title: string;
  severity: number;
  location: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved';
}

interface Communication {
  id: string;
  type: 'message' | 'alert' | 'update';
  sender: string;
  content: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'Medical Lead', status: 'available', location: 'Chennai' },
  { id: '2', name: 'Raj Kumar', role: 'Rescue Specialist', status: 'deployed', location: 'Kerala' },
  { id: '3', name: 'Priya Singh', role: 'Emergency Coordinator', status: 'available', location: 'Mumbai' },
  { id: '4', name: 'Alex Chen', role: 'Logistics Manager', status: 'training', location: 'Delhi' }
];

const mockResources: ResourceItem[] = [
  { id: '1', name: 'Emergency Medical Kits', type: 'Medical', quantity: 500, location: 'Central Warehouse', status: 'available' },
  { id: '2', name: 'Water Purification Units', type: 'Water', quantity: 50, location: 'South Hub', status: 'in-use' },
  { id: '3', name: 'Rescue Boats', type: 'Transport', quantity: 10, location: 'Coastal Station', status: 'maintenance' }
];

const mockIncidents: IncidentReport[] = [
  { id: '1', title: 'Flash Flood Warning', severity: 4, location: 'Wayanad', timestamp: '2025-02-15T10:30:00Z', status: 'new' },
  { id: '2', title: 'Building Collapse', severity: 5, location: 'Mumbai Suburbs', timestamp: '2025-02-15T09:15:00Z', status: 'investigating' },
  { id: '3', title: 'Forest Fire', severity: 3, location: 'Nilgiris', timestamp: '2025-02-15T08:45:00Z', status: 'resolved' }
];

const mockCommunications: Communication[] = [
  { id: '1', type: 'alert', sender: 'Emergency Ops', content: 'Immediate evacuation required in coastal areas', timestamp: '2025-02-15T10:45:00Z', priority: 'high' },
  { id: '2', type: 'message', sender: 'Field Team Alpha', content: 'Rescue operation completed successfully', timestamp: '2025-02-15T10:30:00Z', priority: 'medium' },
  { id: '3', type: 'update', sender: 'Weather Service', content: 'Storm expected to intensify in next 6 hours', timestamp: '2025-02-15T10:15:00Z', priority: 'high' }
];

export default function Dock({ activeView, onViewChange }: DockProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [panelContent, setPanelContent] = useState<React.ReactNode | null>(null);

  const menuItems = [
    { id: 'chat', icon: Bot, label: 'AI Assistant' },
    { id: 'map', icon: Map, label: 'Map View' },
    { id: 'globe', icon: Globe2, label: 'Globe' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'teams', icon: Users, label: 'Teams' },
    { id: 'resources', icon: Box, label: 'Resources' },
    { id: 'incidents', icon: AlertTriangle, label: 'Incidents' },
    { id: 'communications', icon: MessageSquare, label: 'Comms' }
  ];

  const handleViewChange = (view: string) => {
    if (view === 'chat') {
      setShowChat(!showChat);
      if (showPanel) setShowPanel(false);
    } else {
      onViewChange(view);
      if (['teams', 'resources', 'incidents', 'communications'].includes(view)) {
        setShowPanel(true);
        setPanelContent(renderPanelContent(view));
        if (showChat) setShowChat(false);
      } else {
        setShowPanel(false);
      }
    }
  };

  const renderPanelContent = (view: string) => {
    switch (view) {
      case 'teams':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Emergency Response Teams</h2>
            <div className="space-y-4">
              {mockTeamMembers.map(member => (
                <div key={member.id} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-sm text-gray-300">{member.role}</p>
                      <p className="text-sm text-gray-400">{member.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'available' ? 'bg-green-500/20 text-green-300' :
                      member.status === 'deployed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Resource Management</h2>
            <div className="space-y-4">
              {mockResources.map(resource => (
                <div key={resource.id} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{resource.name}</h3>
                      <p className="text-sm text-gray-300">{resource.type}</p>
                      <p className="text-sm text-gray-400">
                        {resource.quantity} units at {resource.location}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resource.status === 'available' ? 'bg-green-500/20 text-green-300' :
                      resource.status === 'in-use' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {resource.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'incidents':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Incident Reports</h2>
            <div className="space-y-4">
              {mockIncidents.map(incident => (
                <div key={incident.id} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{incident.title}</h3>
                      <p className="text-sm text-gray-300">{incident.location}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(incident.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.severity >= 4 ? 'bg-red-500/20 text-red-300' :
                        incident.severity >= 3 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        Severity {incident.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'new' ? 'bg-red-500/20 text-red-300' :
                        incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'communications':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Communications Center</h2>
            <div className="space-y-4">
              {mockCommunications.map(comm => (
                <div key={comm.id} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          comm.priority === 'high' ? 'bg-red-500' :
                          comm.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></span>
                        <h3 className="font-semibold text-white">{comm.sender}</h3>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">{comm.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comm.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      comm.type === 'alert' ? 'bg-red-500/20 text-red-300' :
                      comm.type === 'message' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {comm.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-lg rounded-full p-2 border border-white/10 shadow-lg">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'chat' ? showChat : activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`relative group p-3 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-black/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed bottom-32 right-8 w-96 z-40 shadow-2xl">
          <AIChat />
        </div>
      )}

      {/* Other Panels */}
      {showPanel && panelContent && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-40">
          <div className="glass rounded-xl shadow-xl max-h-[60vh] overflow-y-auto">
            {panelContent}
          </div>
        </div>
      )}
    </>
  );
}