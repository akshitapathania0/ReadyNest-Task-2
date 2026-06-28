import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/assignments').then(r => setAssignments(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (id) => {
    if (!window.confirm('Mark this assignment as submitted?')) return;
    await api.post(`/assignments/${id}/submit`);
    load();
  };

  const filtered = assignments.filter(a => {
    if (filter === 'pending') return !a.mySubmission;
    if (filter === 'submitted') return a.mySubmission?.status === 'submitted';
    if (filter === 'graded') return a.mySubmission?.status === 'graded';
    return true;
  });

  const getStatus = (a) => {
    if (!a.mySubmission) return { label: 'Pending', cls: 'badge-pending' };
    if (a.mySubmission.status === 'graded') return { label: `Graded: ${a.mySubmission.marks}/${a.totalMarks}`, cls: 'badge-graded' };
    return { label: 'Submitted', cls: 'badge-submitted' };
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Assignments</h2><p>{assignments.length} total assignments</p></div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'pending', 'submitted', 'graded'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(a => {
          const status = getStatus(a);
          const days = Math.ceil((new Date(a.dueDate) - new Date()) / 86400000);
          const overdue = days < 0 && !a.mySubmission;
          return (
            <div key={a.id} className="card" style={{ borderLeft: overdue ? '3px solid var(--red)' : a.mySubmission ? '3px solid var(--green)' : '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15 }}>{a.title}</h3>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                    {overdue && <span className="badge badge-high">Overdue</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>
                    📚 {a.subject} &nbsp;·&nbsp; 🏆 {a.totalMarks} marks &nbsp;·&nbsp; 📅 Due: {new Date(a.dueDate).toLocaleDateString('en-IN')}
                    {!overdue && !a.mySubmission && <span style={{ color: days <= 2 ? 'var(--red)' : 'var(--text2)' }}> ({days === 0 ? 'Today!' : `${days} days left`})</span>}
                  </div>
                  {a.description && <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{a.description}</p>}
                </div>
                {!a.mySubmission && !overdue && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleSubmit(a.id)}>Submit ✓</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="empty-state"><div className="icon">📝</div><p>No assignments here</p></div>}
      </div>
    </div>
  );
}
