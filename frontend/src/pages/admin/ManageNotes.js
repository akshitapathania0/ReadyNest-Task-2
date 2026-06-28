import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function ManageNotes() {
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', fileType: 'pdf', semester: 5 });

  const load = () => api.get('/notes').then(r => setNotes(r.data));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.subject) return alert('Fill required fields');
    await api.post('/notes', form);
    await load();
    setModal(false);
    setForm({ title: '', subject: '', description: '', fileType: 'pdf', semester: 5 });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Manage Notes</h2><p>{notes.length} study materials</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Upload Note</button>
      </div>

      <div className="grid-2" style={{ gap: 14 }}>
        {notes.map(n => (
          <div key={n.id} className="card">
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 14, marginBottom: 4 }}>{n.title}</h3>
                <span className="badge badge-event" style={{ marginBottom: 6, display: 'inline-block' }}>{n.subject}</span>
                {n.description && <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{n.description}</p>}
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(n.uploadedAt).toLocaleDateString('en-IN')}</div>
              </div>
              <button className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => handleDelete(n.id)}>✕</button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <div className="empty-state" style={{ gridColumn: '1/-1' }}><div className="icon">📚</div><p>No notes uploaded yet</p></div>}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Upload Note</h3><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Note title" /></div>
              <div className="form-group"><label>Subject *</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this cover?" /></div>
              <div className="form-group">
                <label>File Type</label>
                <select value={form.fileType} onChange={e => setForm({ ...form, fileType: e.target.value })}>
                  <option value="pdf">PDF</option><option value="ppt">PowerPoint</option><option value="doc">Word</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
