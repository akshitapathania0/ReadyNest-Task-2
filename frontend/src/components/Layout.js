import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentNav = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/timetable', icon: '📅', label: 'Timetable' },
  { to: '/assignments', icon: '📝', label: 'Assignments' },
  { to: '/attendance', icon: '✅', label: 'Attendance' },
  { to: '/notes', icon: '📚', label: 'Notes' },
  { to: '/notices', icon: '📢', label: 'Notices' },
  { to: '/profile', icon: '👤', label: 'My Profile' },
];

const adminNav = [
  { to: '/admin', icon: '🏠', label: 'Dashboard' },
  { to: '/admin/notices', icon: '📢', label: 'Notices' },
  { to: '/admin/timetable', icon: '📅', label: 'Timetable' },
  { to: '/admin/assignments', icon: '📝', label: 'Assignments' },
  { to: '/admin/notes', icon: '📚', label: 'Notes' },
  { to: '/admin/students', icon: '👥', label: 'Students' },
  { to: '/admin/attendance', icon: '✅', label: 'Attendance' },
  { to: '/admin/profile', icon: '👤', label: 'My Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = user?.role === 'admin' ? adminNav : studentNav;
  const profilePath = user?.role === 'admin' ? '/admin/profile' : '/profile';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16 }}>UniTrack</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflow: 'auto' }}>
          {nav.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/dashboard' || item.to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                borderRadius: 8, marginBottom: 2, textDecoration: 'none', fontSize: 13, fontWeight: 500,
                color: isActive ? 'var(--primary-light)' : 'var(--text2)',
                background: isActive ? 'var(--primary-dim)' : 'transparent',
                transition: 'all 0.15s'
              })}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>

        {/* User — clickable to go to profile */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          <div
            onClick={() => navigate(profilePath)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: 32, height: 32, background: 'var(--primary-dim)', border: '1px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--primary-light)', flexShrink: 0 }}>
              {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              {user?.rollNo
                ? <div style={{ fontSize: 10, color: 'var(--text3)' }}>{user.rollNo}</div>
                : <div style={{ fontSize: 10, color: 'var(--text3)' }}>Edit profile →</div>
              }
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: '28px', minHeight: '100vh', background: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  );
}
