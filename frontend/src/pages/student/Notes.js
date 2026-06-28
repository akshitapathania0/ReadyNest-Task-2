import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const FILE_ICONS = { pdf: '📄', ppt: '📊', doc: '📃', zip: '🗜️' };

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [subject, setSubject] = useState('');
  const subjects = [...new Set(notes.map(n => n.subject))];

  useEffect(() => { api.get('/notes').then(r => setNotes(r.data)); }, []);

  const filtered = subject ? notes.filter(n => n.subject === subject) : notes;

  return (
    <div>
      <div className="page-header">
        <div><h2>Study Notes</h2><p>{notes.length} materials available</p></div>
        <select style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: 13 }} value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid-2" style={{ gap: 14 }}>
        {filtered.map(n => (
          <div key={n.id} className="card" style={{ display: 'flex', gap: 14 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{FILE_ICONS[n.fileType] || '📄'}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 14, marginBottom: 4 }}>{n.title}</h3>
              <span className="badge badge-event" style={{ marginBottom: 6, display: 'inline-block' }}>{n.subject}</span>
              {n.description && <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 8 }}>{n.description}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>By {n.uploadedByName} · {new Date(n.uploadedAt).toLocaleDateString('en-IN')}</div>
                <button className="btn btn-ghost btn-sm">⬇️ Download</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-state" style={{ gridColumn: '1/-1' }}><div className="icon">📚</div><p>No notes available</p></div>}
      </div>
    </div>
  );
}
