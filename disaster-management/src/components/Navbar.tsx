import React, { useState } from 'react';
import { Activity, Settings, Bell, HelpCircle, User, LogOut, Shield, Mail, AlertTriangle, Bot } from 'lucide-react';
import AIChat from './AIChat';

interface NotificationItem {
  id: string;
  type: 'alert' | 'update' | 'info';
  title: string;
  message: string;
  time: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'New Emergency Alert',
    message: 'Cyclone warning issued for coastal regions',
    time: '5 minutes ago'
  },
  {
    id: '2',
    type: 'update',
    title: 'Resource Update',
    message: 'Medical supplies deployed to Chennai',
    time: '15 minutes ago'
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update',
    message: 'New features added to the dashboard',
    time: '1 hour ago'
  }
];

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const renderNotificationsPanel = () => (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.map(notification => (
          <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-start">
              {notification.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />}
              {notification.type === 'update' && <Mail className="w-5 h-5 text-blue-500 mt-1" />}
              {notification.type === 'info' && <Shield className="w-5 h-5 text-green-500 mt-1" />}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800">Mark all as read</button>
      </div>
    </div>
  );

  const renderSettingsPanel = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">Enable desktop notifications</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">Dark mode</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">Auto-refresh data</span>
            </label>
          </div>
          <div>
            <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpPanel = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
            Documentation
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
            Video Tutorials
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
            FAQs
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfilePanel = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-semibold">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@emergency.gov</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
          Profile Settings
        </button>
        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
          Security
        </button>
        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg">
          Preferences
        </button>
        <div className="border-t border-gray-200 mt-2 pt-2">
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white">DisasterHub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="p-2 text-gray-300 hover:text-white transition-colors relative"
                onClick={() => setShowChat(!showChat)}
              >
                <Bot className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              {showChat && (
                <div className="absolute right-0 mt-2 w-96 z-50">
                  <AIChat onClose={() => setShowChat(false)} />
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                className="p-2 text-gray-300 hover:text-white transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && renderNotificationsPanel()}
            </div>

            <div className="relative">
              <button 
                className="p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-5 h-5" />
              </button>
              {showSettings && renderSettingsPanel()}
            </div>

            <div className="relative">
              <button 
                className="p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowHelp(!showHelp)}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              {showHelp && renderHelpPanel()}
            </div>

            <div className="w-px h-6 bg-white/20"></div>

            <div className="relative">
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setShowProfile(!showProfile)}
              >
                <User className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white">Admin</span>
              </button>
              {showProfile && renderProfilePanel()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}