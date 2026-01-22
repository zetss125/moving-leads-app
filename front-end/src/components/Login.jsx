import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('facebook'); // 'facebook' or 'mock'

  const handleMockLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use mock data for testing
      const mockData = {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 'mock-' + Math.random().toString(36).substr(2, 9),
          name: 'Test User ' + Math.floor(Math.random() * 1000),
          email: `test${Math.floor(Math.random() * 1000)}@example.com`,
          location: ['New York', 'Chicago', 'Los Angeles', 'Miami'][Math.floor(Math.random() * 4)],
          score: Math.floor(Math.random() * 100),
          signals: [
            'Posted about moving apartments',
            'Joined "Chicago Relocation" group',
            'Asked for moving recommendations',
            'Location changed to Chicago'
          ].slice(0, 2 + Math.floor(Math.random() * 2)),
          urgency: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
          platform: 'mock'
        }
      };
      
      // Simulate API delay
      setTimeout(() => {
        onLogin({
          token: mockData.token,
          user: mockData.user,
          platform: 'mock'
        });
        setLoading(false);
      }, 800);
      
    } catch (err) {
      setError('Mock login failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
  setLoading(true);
  setError('');
  window.location.href = 'https://moving-leads-backend.onrender.com/auth/facebook';
};


  const handleManualToken = async (e) => {
    e.preventDefault();
    const token = e.target.token.value.trim();
    
    if (!token) {
      setError('Please enter a token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call backend API
      const response = await axios.post(
  'https://moving-leads-backend.onrender.com/api/analyze-facebook',
  { accessToken: token }
);


      if (response.data.success) {
        onLogin({
          token: token,
          user: response.data.lead,
          platform: 'facebook'
        });
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-4xl">🚚</div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Moving Leads Generator
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Find potential moving customers through social media analysis
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('facebook')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'facebook'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔵 Facebook Login
            </button>
            <button
              onClick={() => setActiveTab('mock')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mock'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Mock Data (Test)
            </button>
          </nav>
        </div>

        {/* Facebook Tab */}
        {activeTab === 'facebook' && (
          <div className="space-y-6">
            <button
              onClick={handleFacebookLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting to Facebook...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Advanced</span>
              </div>
            </div>

            <form onSubmit={handleManualToken} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Facebook Access Token
                </label>
                <textarea
                  id="token"
                  name="token"
                  rows="3"
                  placeholder="Paste Facebook access token here..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Get token from Facebook Graph API Explorer
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze with Token'}
              </button>
            </form>
          </div>
        )}

        {/* Mock Data Tab */}
        {activeTab === 'mock' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Test Mode:</strong> Using mock data for development. No real Facebook connection.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleMockLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Generating Mock Data...
                </>
              ) : (
                <>
                  <span className="mr-2">🧪</span>
                  Login with Mock Data
                </>
              )}
            </button>

            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">Mock Data Includes:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Random user profiles</li>
                <li>Simulated moving signals</li>
                <li>Lead scoring (0-100)</li>
                <li>Priority levels (HIGH/MEDIUM/LOW)</li>
                <li>Complete dashboard functionality</li>
              </ul>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By logging in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Terms</a> and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>.
            <br />
            We only access public data with your permission.
          </p>
        </div>
      </div>
    </div>
  );
}