import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    api.get('/notices').then(r => setNotices(r.data.slice(0, 3)));
    api.get('/assignments').then(r => setAssignments(r.data));
    api.get('/attendance').then(r => setAttendance(r.data));
  }, []);

  const pending = assignments.filter(a => !a.mySubmission).length;
  const avgAttendance = attendance.length ? Math.round(attendance.reduce((s, a) => s + a.percentage, 0) / attendance.length) : 0;
  const due = assignments.filter(a => !a.mySubmission && new Date(a.dueDate) > new Date()).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = DAYS[new Date().getDay()];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24 }}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124,106,247,0.15)' }}>📝</div>
          <div><div className="stat-value">{pending}</div><div className="stat-label">Pending Assignments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: avgAttendance >= 75 ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)' }}>✅</div>
          <div><div className="stat-value" style={{ color: avgAttendance >= 75 ? 'var(--green)' : 'var(--red)' }}>{avgAttendance}%</div><div className="stat-label">Avg Attendance</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.1)' }}>📢</div>
          <div><div className="stat-value">{notices.length}</div><div className="stat-label">New Notices</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(240,98,146,0.1)' }}>📚</div>
          <div><div className="stat-value">{user?.semester || 5}</div><div className="stat-label">Current Semester</div></div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Upcoming deadlines */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>⏰ Upcoming Deadlines</h3>
          {due.length === 0 ? <div className="empty-state" style={{ padding: '24px 0' }}><div className="icon">🎉</div><p>No pending assignments!</p></div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {due.slice(0, 4).map(a => {
                const days = Math.ceil((new Date(a.dueDate) - new Date()) / 86400000);
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{a.subject}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: days <= 2 ? 'var(--red)' : days <= 5 ? 'var(--yellow)' : 'var(--text2)', whiteSpace: 'nowrap' }}>
                      {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days} days`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent notices */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>📢 Latest Notices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notices.map(n => (
              <div key={n.id} style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`badge badge-${n.priority}`}>{n.priority}</span>
                  <span className={`badge badge-${n.category}`}>{n.category}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>✅ Attendance Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {attendance.map(a => (
              <div key={a.subject} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 180, fontSize: 13, fontWeight: 500 }}>{a.subject}</div>
                <div style={{ flex: 1, height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.percentage}%`, background: a.percentage >= 75 ? 'var(--green)' : a.percentage >= 60 ? 'var(--yellow)' : 'var(--red)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
                <div style={{ width: 44, textAlign: 'right', fontSize: 13, fontWeight: 600, color: a.percentage >= 75 ? 'var(--green)' : a.percentage >= 60 ? 'var(--yellow)' : 'var(--red)' }}>
                  {a.percentage}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', width: 60 }}>{a.present}/{a.total}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
