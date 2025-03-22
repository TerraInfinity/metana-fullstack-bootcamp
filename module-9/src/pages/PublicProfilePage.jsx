/**
 * PublicProfilePage.jsx
 * The user profile page with tab navigation for managing profiles, viewing stats, and activity.
 * This component displays the public profile of a user, including stats and activity.
 * 
 * @component
 * @returns {JSX.Element} The rendered public profile page component.
 * 
 * @example
 * // Usage of PublicProfilePage component
 * <PublicProfilePage />
 * 
 * @state {Object} user - The user data fetched from the backend.
 * @state {string} currentTab - The currently selected tab for navigation.
 * 
 * @effect Fetches user profile data from the backend API when the component mounts.
 * @context AuthContext - Provides authentication context for the component.
 */
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './components/common/Layout.jsx';
import StatsCard from './components/AdminDashboardPage/Tabs/StatsCard.jsx'; 
import AchievementsGrid from './components/AdminDashboardPage/Tabs/AchievementsGrid.jsx'; 
import ActivityFeed from './components/AdminDashboardPage/Tabs/ActivityFeed.jsx'; 

export function PublicProfilePage() {
  const { id } = useParams();
  console.log("User ID:", id);
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('publicProfile'); // State for tab navigation
  const navigate = useNavigate();
  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const backendProfileAPIUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/profile/${id}`;

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(backendProfileAPIUrl);
      const data = await response.json();
      console.log('Fetched user profile:', data);
      if (response.ok) {
        setUser(data);
      } else {
        console.log('Error fetching profile:', response.status);
      }
    };
    fetchProfile();
  }, []); // Removed token and navigate from dependencies

  if (!user) return <div className="text-white">Loading user profile...</div>;

  return (
    <Layout title="Public Profile">
      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setCurrentTab('publicProfile')}
          className={`p-2 rounded ${
            currentTab === 'publicProfile' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}
        >
          Public Profile
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
      </div>

      {/* Tab Content */}
      {currentTab === 'publicProfile' && (
        <div className="text-white text-center">
          <h2>Name: {user.name}</h2>
          <p>Level: {user.level} || 0 </p>
          <p>XP: {user.xp || '0' }</p>
          <p>Age: {user.age || 'Not specified'}</p>
          <p>Gender: {user.gender || 'Not specified'}</p>
          <p>Orientation: {user.orientation || 'Not specified'}</p>
          <p>Pronouns: {user.pronouns || 'Not specified'}</p>
          <p>Bio: {user.bio || 'No bio yet.'}</p>
        </div>
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
    </Layout>
  );
}