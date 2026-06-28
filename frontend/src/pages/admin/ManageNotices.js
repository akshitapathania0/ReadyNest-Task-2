import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'medium', targetAudience: 'all' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/notices').then(r => setNotices(r.data));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.content) return alert('Fill all required fields');
    setSaving(true);
    await api.post('/notices', form);
    await load();
    setModal(false);
    setForm({ title: '', content: '', category: 'general', priority: 'medium', targetAudience: 'all' });
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await api.delete(`/notices/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Manage Notices</h2><p>{notices.length} total notices</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Notice</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notices.map(n => (
          <div key={n.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <span className={`badge badge-${n.priority}`}>{n.priority}</span>
                <span className={`badge badge-${n.category}`}>{n.category}</span>
              </div>
              <h3 style={{ fontSize: 15, marginBottom: 4 }}>{n.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>{n.content.slice(0, 120)}{n.content.length > 120 ? '…' : ''}</p>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>Delete</button>
          </div>
        ))}
        {notices.length === 0 && <div className="empty-state"><div className="icon">📢</div><p>No notices yet</p></div>}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>New Notice</h3><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Notice title" /></div>
              <div className="form-group"><label>Content *</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Notice details…" rows={4} /></div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="general">General</option><option value="exam">Exam</option><option value="event">Event</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Publishing…' : 'Publish Notice'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
