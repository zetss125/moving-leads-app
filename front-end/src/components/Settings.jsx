import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    leadThreshold: 60,
    autoExport: false,
    theme: 'light',
    apiKey: '',
    serviceArea: ['New York', 'Chicago', 'Los Angeles']
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newCity, setNewCity] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('movingLeadsSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('movingLeadsSettings', JSON.stringify(settings));
      setSaving(false);
      setMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      leadThreshold: 60,
      autoExport: false,
      theme: 'light',
      apiKey: '',
      serviceArea: ['New York', 'Chicago', 'Los Angeles']
    };
    
    setSettings(defaultSettings);
    setMessage('Settings reset to defaults');
    setTimeout(() => setMessage(''), 3000);
  };

  const addCity = () => {
    if (newCity.trim() && !settings.serviceArea.includes(newCity.trim())) {
      setSettings({
        ...settings,
        serviceArea: [...settings.serviceArea, newCity.trim()]
      });
      setNewCity('');
    }
  };

  const removeCity = (city) => {
    setSettings({
      ...settings,
      serviceArea: settings.serviceArea.filter(c => c !== city)
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your lead generation preferences and notification settings.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-green-700">{message}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Notifications Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔔 Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Alerts</label>
                <p className="text-sm text-gray-500">Receive email notifications for new high-priority leads</p>
              </div>
              <button
                onClick={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.emailAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">SMS Alerts</label>
                <p className="text-sm text-gray-500">Receive text message alerts (requires phone number)</p>
              </div>
              <button
                onClick={() => setSettings({...settings, smsAlerts: !settings.smsAlerts})}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.smsAlerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.smsAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Lead Threshold Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Lead Threshold</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                High-Priority Threshold: {settings.leadThreshold}+ score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.leadThreshold}
                onChange={(e) => setSettings({...settings, leadThreshold: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0 (All leads)</span>
                <span>50</span>
                <span>100 (Very strict)</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Leads scoring above this threshold will be marked as high priority.
            </p>
          </div>
        </div>

        {/* Service Area Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Service Area</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add cities where your moving company operates. Leads from these locations will be prioritized.
            </p>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addCity()}
              />
              <button
                onClick={addCity}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add City
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.serviceArea.map((city, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {city}
                  <button
                    onClick={() => removeCity(city)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Settings Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔑 API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook API Key (Optional)
              </label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                placeholder="Enter your Facebook API key"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add your Facebook API key to enable real Facebook data analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎨 Theme</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setSettings({...settings, theme: 'light'})}
              className={`px-4 py-3 rounded-lg border-2 ${
                settings.theme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-400 mr-3"></div>
                <div>
                  <div className="font-medium">Light</div>
                  <div className="text-sm text-gray-500">Default theme</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setSettings({...settings, theme: 'dark'})}
              className={`px-4 py-3 rounded-lg border-2 ${
                settings.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-800 mr-3"></div>
                <div>
                  <div className="font-medium">Dark</div>
                  <div className="text-sm text-gray-500">Easier on eyes</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset to Defaults
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}