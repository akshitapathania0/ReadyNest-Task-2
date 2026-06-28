import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { api.get('/notices').then(r => setNotices(r.data)); }, []);

  const filtered = filter === 'all' ? notices : notices.filter(n => n.category === filter);

  return (
    <div>
      <div className="page-header">
        <div><h2>Notices</h2><p>{notices.length} announcements</p></div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'exam', 'event', 'general'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(n => (
          <div key={n.id} className="card">
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span className={`badge badge-${n.priority}`}>{n.priority}</span>
              <span className={`badge badge-${n.category}`}>{n.category}</span>
            </div>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>{n.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{n.content}</p>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
              Posted by {n.createdByName} · {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state"><div className="icon">📢</div><p>No notices found</p></div>}
      </div>
    </div>
  );
}
