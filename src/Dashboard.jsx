import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  const stats = [
    { label: 'Total Users', value: '24,567', change: '+12.5%', trend: 'up' },
    { label: 'Revenue', value: '$89,234', change: '+8.2%', trend: 'up' },
    { label: 'Active Sessions', value: '1,847', change: '-2.1%', trend: 'down' },
    { label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' }
  ];

  const recentActivity = [
    { user: 'Sarah Chen', action: 'Created new project', time: '2 min ago', avatar: 'SC' },
    { user: 'Michael Rodriguez', action: 'Updated user permissions', time: '5 min ago', avatar: 'MR' },
    { user: 'Emily Johnson', action: 'Generated monthly report', time: '12 min ago', avatar: 'EJ' },
    { user: 'David Kim', action: 'Deployed to production', time: '18 min ago', avatar: 'DK' }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, Alex</p>
          </div>
          <div className="header-right">
            <button 
              className="notification-btn" 
              aria-label="Notifications"
              onClick={() => setNotifications(0)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
            <div className="user-avatar">
              <span>AK</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          {['overview', 'analytics', 'users', 'settings'].map((tab) => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Grid */}
        <section className="stats-section">
          <h2 className="section-title">Key Metrics</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <span className={`stat-trend ${stat.trend}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {stat.trend === 'up' ? (
                        <path d="M7 17L17 7M17 7H7M17 7V17"/>
                      ) : (
                        <path d="M17 7L7 17M7 17H17M7 17V7"/>
                      )}
                    </svg>
                    {stat.change}
                  </span>
                </div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Chart Section */}
          <section className="chart-section">
            <div className="section-header">
              <h3 className="section-title">Performance Overview</h3>
              <button className="action-btn secondary">View Details</button>
            </div>
            <div className="chart-placeholder">
              <div className="chart-mockup">
                <div className="chart-bars">
                  <div className="bar" style={{height: '60%'}}></div>
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar" style={{height: '45%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                  <div className="bar" style={{height: '65%'}}></div>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-color primary"></span>
                    Revenue
                  </span>
                  <span className="legend-item">
                    <span className="legend-color secondary"></span>
                    Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="activity-section">
            <div className="section-header">
              <h3 className="section-title">Recent Activity</h3>
              <button className="action-btn text">See All</button>
            </div>
            <div className="activity-feed">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-avatar">{activity.avatar}</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>{activity.user}</strong> {activity.action}
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Action Cards */}
        <section className="actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h4>Generate Report</h4>
              <p>Create comprehensive analytics reports</p>
              <button className="action-btn primary">Generate</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h4>Invite Users</h4>
              <p>Add new team members to your workspace</p>
              <button className="action-btn primary">Invite</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h4>Settings</h4>
              <p>Configure your workspace preferences</p>
              <button className="action-btn secondary">Configure</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
