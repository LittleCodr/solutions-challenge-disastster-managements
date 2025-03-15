import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Users, Box, Bell, Map as MapIcon, BarChart, Plus, Bot } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import Map from './Map';
import Analytics from './Analytics';
import ReportIncident from './ReportIncident';
import ResourceModal from './ResourceModal';
import AlertModal from './AlertModal';
import AIChat from './AIChat';
import { Globe } from './Globe';
import Dock from './Dock';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, color }: { 
  icon: React.ElementType, 
  label: string, 
  value: string | number,
  color: string 
}) => (
  <div className="card hover-lift">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color} backdrop-blur-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-300 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { 
    disasters, 
    resources, 
    teams, 
    alerts,
    loading,
    error,
    fetchInitialData,
    subscribeToUpdates,
    unsubscribeFromUpdates
  } = useDisasterStore();

  const [activeView, setActiveView] = useState('map');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
    subscribeToUpdates();
    return () => unsubscribeFromUpdates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-animate flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-animate flex items-center justify-center">
        <div className="glass p-6 rounded-lg text-white" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const activeDisasters = disasters.filter(d => d.status === 'active').length;
  const availableTeams = teams.filter(t => t.status === 'available').length;
  const deployedResources = resources.filter(r => r.status === 'deployed').length;
  const activeAlerts = alerts.filter(a => a.status === 'sent').length;

  const renderContent = () => {
    switch (activeView) {
      case 'map':
        return <Map onDisasterSelect={setSelectedDisaster} />;
      case 'globe':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Globe />
          </div>
        );
      case 'analytics':
        return <Analytics />;
      default:
        return <Map onDisasterSelect={setSelectedDisaster} />;
    }
  };

  return (
    <div className="min-h-screen bg-animate pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={AlertTriangle}
            label="Active Disasters"
            value={activeDisasters}
            color="bg-red-500/30"
          />
          <StatCard 
            icon={Users}
            label="Available Teams"
            value={availableTeams}
            color="bg-blue-500/30"
          />
          <StatCard 
            icon={Box}
            label="Deployed Resources"
            value={deployedResources}
            color="bg-purple-500/30"
          />
          <button 
            onClick={() => setShowChat(true)}
            className="card hover-lift relative group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-500/30 backdrop-blur-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">AI Assistant</p>
                <p className="text-2xl font-bold text-white">Ask Me Anything</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"></div>
          </button>
        </div>

        <div className="glass mb-8 rounded-xl overflow-hidden" style={{ height: '600px' }}>
          {renderContent()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Active Disasters</h2>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-all hover-lift flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report Incident</span>
                  </button>
                  <button 
                    onClick={() => setShowAlertModal(true)}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-white px-4 py-2 rounded-lg transition-all hover-lift flex items-center space-x-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Send Alert</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disasters
                  .filter(d => d.status === 'active')
                  .map(disaster => (
                    <div 
                      key={disaster.id} 
                      className={`glass hover-lift transition-all duration-200 cursor-pointer ${
                        selectedDisaster === disaster.id 
                          ? 'border-blue-500/50 shadow-lg' 
                          : 'hover:border-blue-300/30'
                      }`}
                      onClick={() => setSelectedDisaster(disaster.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                          ${disaster.severity >= 4 ? 'bg-red-500/20 text-red-300' : 
                            disaster.severity >= 3 ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-blue-500/20 text-blue-300'}`}>
                          Level {disaster.severity}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {format(new Date(disaster.created_at), 'MMM d, HH:mm')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-white mb-1">{disaster.title}</h3>
                      <p className="text-gray-300 mb-2">{disaster.location_name}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{disaster.affected_population?.toLocaleString() || 'Unknown'} affected</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDisaster(disaster.id);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Resource Status</h2>
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-4 py-2 rounded-lg transition-all hover-lift flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>
              <div className="space-y-4">
                {resources.map(resource => (
                  <div key={resource.id} className="glass hover-lift p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">{resource.name}</p>
                        <p className="text-sm text-gray-400">{resource.location_name}</p>
                        <p className="text-xs text-gray-500">Quantity: {resource.quantity} {resource.unit}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${resource.status === 'available' ? 'bg-green-500/20 text-green-300' :
                          resource.status === 'in-transit' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'}`}>
                        {resource.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Alerts</h2>
              <div className="space-y-4">
                {alerts
                  .filter(a => a.status === 'sent')
                  .slice(0, 5)
                  .map(alert => (
                    <div key={alert.id} className="glass hover-lift p-4 rounded-lg border-l-4 border-yellow-500/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-yellow-300">{alert.title}</h3>
                        <span className="text-xs text-yellow-400/70">
                          {format(new Date(alert.sent_at || alert.created_at), 'HH:mm')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-300">{alert.message}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dock activeView={activeView} onViewChange={setActiveView} />

      {showReportModal && (
        <ReportIncident onClose={() => setShowReportModal(false)} />
      )}

      {showResourceModal && (
        <ResourceModal onClose={() => setShowResourceModal(false)} />
      )}

      {showAlertModal && (
        <AlertModal onClose={() => setShowAlertModal(false)} disasterId={selectedDisaster} />
      )}

      {showChat && (
        <div className="fixed bottom-32 right-8 w-96 z-50 shadow-2xl">
          <AIChat onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
}