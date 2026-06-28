import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get('/notices').then(r => setNotices(r.data));
    api.get('/assignments').then(r => setAssignments(r.data));
    api.get('/students').then(r => setStudents(r.data));
    api.get('/notes').then(r => setNotes(r.data));
  }, []);

  const totalSubs = assignments.reduce((s, a) => s + a.submissions.length, 0);
  const pendingGrading = assignments.reduce((s, a) => s + a.submissions.filter(sub => sub.status === 'submitted').length, 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24 }}>Admin Dashboard</h2>
        <p style={{ color: 'var(--text2)', marginTop: 4 }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124,106,247,0.15)' }}>👥</div>
          <div><div className="stat-value">{students.length}</div><div className="stat-label">Students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(240,98,146,0.15)' }}>📢</div>
          <div><div className="stat-value">{notices.length}</div><div className="stat-label">Notices</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.15)' }}>📝</div>
          <div><div className="stat-value">{assignments.length}</div><div className="stat-label">Assignments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: pendingGrading > 0 ? 'rgba(248,113,113,0.15)' : 'rgba(74,222,128,0.15)' }}>✏️</div>
          <div><div className="stat-value" style={{ color: pendingGrading > 0 ? 'var(--red)' : 'var(--green)' }}>{pendingGrading}</div><div className="stat-label">Pending Grading</div></div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Submissions to grade */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>✏️ Submissions to Grade</h3>
          {assignments.filter(a => a.submissions.some(s => s.status === 'submitted')).length === 0
            ? <div className="empty-state" style={{ padding: '20px 0' }}><div className="icon">✅</div><p>All caught up!</p></div>
            : assignments.filter(a => a.submissions.some(s => s.status === 'submitted')).map(a => (
              <div key={a.id} style={{ padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                  {a.submissions.filter(s => s.status === 'submitted').length} submission(s) waiting · {a.subject}
                </div>
              </div>
            ))
          }
        </div>

        {/* Students list */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>👥 Students</h3>
          {students.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 32, height: 32, background: 'var(--primary-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--primary-light)' }}>
                {s.avatar}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{s.rollNo} · {s.course}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent notices */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>📢 Recent Notices</h3>
          {notices.slice(0, 3).map(n => (
            <div key={n.id} style={{ padding: '8px 12px', background: 'var(--bg2)', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
          ))}
        </div>

        {/* Notes summary */}
        <div className="card">
          <h3 style={{ fontSize: 15, marginBottom: 16 }}>📚 Notes ({notes.length} uploaded)</h3>
          {notes.slice(0, 4).map(n => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span>📄</span>
              <div>
                <div style={{ fontSize: 13 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{n.subject}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
