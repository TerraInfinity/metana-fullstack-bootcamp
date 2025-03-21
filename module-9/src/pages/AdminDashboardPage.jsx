/**
 * AdminDashboardPage.jsx
 * The user profile page with tab navigation for managing profiles, viewing stats, activity, and privacy settings.
 * This file defines the layout and functionality of the admin dashboard, including components for managing user profiles and settings.
 */
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProfileManager from './components/AdminDashboardPage/Tabs/UserProfile/ProfileManager';
import StatsCard from './components/AdminDashboardPage/Tabs/StatsCard'; 
import AchievementsGrid from './components/AdminDashboardPage/Tabs/AchievementsGrid.jsx'; 
import ActivityFeed from './components/AdminDashboardPage/Tabs/ActivityFeed.jsx'; 
import PrivacySettings from './components/AdminDashboardPage/Tabs/PrivacySettings.jsx'; 
import LogoutButton from './components/AdminDashboardPage/Tabs/UserProfile/LogoutButton';
import DeleteAccountModal from './components/AdminDashboardPage/Tabs/UserProfile/DeleteAccountModal';
import SiteSettings from './components/AdminDashboardPage/Tabs/SiteSettings/SiteSettings'; 

/**
 * The AdminDashboardPage component manages the layout and functionality of the admin dashboard.
 * It handles user authentication, profile data fetching, and tab navigation.
 * @returns {JSX.Element} The admin dashboard page component.
 */
export function AdminDashboardPage() {
  const { token, logout, isAuthenticated, loading } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('admin'); // State for tab navigation
  const navigate = useNavigate();
  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const backendProfileAPIUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/profile`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  /**
   * Fetches the user profile data from the backend API.
   * Handles authentication and redirects to login page if unauthorized.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(backendProfileAPIUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('Fetched user profile:', data);
      if (response.ok) {
        setUser(data);
        const storedMessage = sessionStorage.getItem('updateMessage');
        if (storedMessage) {
          setUpdateMessage(storedMessage);
          sessionStorage.removeItem('updateMessage');
        }
      } else if (response.status === 401) {
        console.log('Unauthorized, logging out');
        logout();
        navigate('/login');
      }
    };
    fetchProfile();
  }, [token, logout, navigate]);

  // Accessing the user ID
  const userId = user ? user.id : null; // Safely access user ID

  // Example usage of userId
  console.log('Current User ID:', userId);

  /**
   * Handles profile updates by sending a PUT request to the backend API.
   * @param {object} formData The updated profile data.
   */
  const handleUpdate = async (formData) => {
    const response = await fetch(backendProfileAPIUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      sessionStorage.setItem('updateMessage', 'Profile updated successfully!');
      window.location.reload();
    }
  };

  /**
   * Handles account deletion by logging out and redirecting to the home page.
   */
  const handleDeleteAccount = () => {
    console.log('Account deleted');
    logout();
    navigate('/home');
  };

  if (loading) return <div className="text-white">Loading authentication...</div>;
  if (!isAuthenticated) return <div className="text-red-500">Please log in to access your profile.</div>;
  if (!user) return <div className="text-white">Loading user profile...</div>;

  return (
    <Layout title="User Profile">
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setCurrentTab('admin')}
          className={`p-2 rounded ${
            currentTab === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => setCurrentTab('stats')}
          className={`p-2 rounded ${
            currentTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setCurrentTab('activity')}
          className={`p-2 rounded ${
            currentTab === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Activity Feed
        </button>
        <button
          onClick={() => setCurrentTab('privacy')}
          className={`p-2 rounded ${
            currentTab === 'privacy' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setCurrentTab('SiteSettings')}
          className={`p-2 rounded ${
            currentTab === 'SiteSettings' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Site Settings
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === 'admin' && (
        <>
          {updateMessage && <div className="text-green-500">{updateMessage}</div>}
          <ProfileManager user={user} onUpdate={handleUpdate} />
          <LogoutButton onLogout={() => { logout(); navigate('/login'); }} />
          <div className="flex justify-center my-4">
            <button onClick={() => setIsModalOpen(true)} className="bg-red-600 p-2 rounded">
              Delete Account
            </button>
          </div>
          <DeleteAccountModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDelete={handleDeleteAccount}
          />
        </>
      )}

      {currentTab === 'stats' && (
        <div className="space-y-4">
          {user.stats ? (
            <StatsCard stats={user.id} />
          ) : (
            <div className="text-white"></div>
          )}
          {user.achievements && user.achievements.length > 0 ? (
            <AchievementsGrid achievements={user.id} />
          ) : (
            <div className="text-white"></div>
          )}
        </div>
      )}
      {currentTab === 'activity' && (
        <ActivityFeed userId={user.id} />
      )}
      {currentTab === 'privacy' && (
        <PrivacySettings
          privacySettings={user.privacySettings}
          onUpdatePrivacy={(updatedSettings) => {
            console.log('Updating privacy settings:', updatedSettings);
            // Add your update logic here
          }}
        />
      )}
      {currentTab === 'SiteSettings' && (
        <SiteSettings
          onUpdateSettings={(updatedSettings) => {
            console.log('Updating settings:', updatedSettings);
            // Add your update logic here
          }}
        />
      )}
    </Layout>
  );
}