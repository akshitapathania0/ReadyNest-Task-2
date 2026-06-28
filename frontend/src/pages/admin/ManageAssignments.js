import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', dueDate: '', totalMarks: 20, semester: 5 });
  const [expanded, setExpanded] = useState(null);

  const load = () => { api.get('/assignments').then(r => setAssignments(r.data)); api.get('/students').then(r => setStudents(r.data)); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.subject || !form.dueDate) return alert('Fill required fields');
    await api.post('/assignments', form);
    await load();
    setModal(false);
    setForm({ title: '', subject: '', description: '', dueDate: '', totalMarks: 20, semester: 5 });
  };

  const handleGrade = async (assignId, studentId, marks) => {
    await api.patch(`/assignments/${assignId}/grade/${studentId}`, { marks: parseInt(marks) });
    load();
  };

  const getStudentName = (id) => students.find(s => s.id === id)?.name || id;

  return (
    <div>
      <div className="page-header">
        <div><h2>Manage Assignments</h2><p>{assignments.length} assignments</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Assignment</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {assignments.map(a => (
          <div key={a.id} className="card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, cursor: 'pointer' }} onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15 }}>{a.title}</h3>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
                  📚 {a.subject} · 🏆 {a.totalMarks} marks · 📅 {new Date(a.dueDate).toLocaleDateString('en-IN')} · 📨 {a.submissions.length} submissions
                </div>
              </div>
              <span style={{ color: 'var(--text3)', fontSize: 18 }}>{expanded === a.id ? '▲' : '▼'}</span>
            </div>

            {expanded === a.id && (
              <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <h4 style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Submissions</h4>
                {a.submissions.length === 0
                  ? <p style={{ fontSize: 13, color: 'var(--text3)' }}>No submissions yet</p>
                  : a.submissions.map(sub => (
                    <div key={sub.studentId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--bg2)', borderRadius: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{getStudentName(sub.studentId)}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)' }}>Submitted: {new Date(sub.submittedAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      {sub.status === 'graded'
                        ? <span className="badge badge-graded">Graded: {sub.marks}/{a.totalMarks}</span>
                        : (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input type="number" min="0" max={a.totalMarks} placeholder="Marks"
                              style={{ width: 70, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 13 }}
                              id={`grade-${a.id}-${sub.studentId}`} />
                            <button className="btn btn-primary btn-sm" onClick={() => {
                              const el = document.getElementById(`grade-${a.id}-${sub.studentId}`);
                              if (el.value) handleGrade(a.id, sub.studentId, el.value);
                            }}>Grade</button>
                          </div>
                        )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>New Assignment</h3><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" /></div>
              <div className="form-group"><label>Subject *</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" /></div>
              <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Assignment details…" /></div>
              <div className="grid-2">
                <div className="form-group"><label>Due Date *</label><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
                <div className="form-group"><label>Total Marks</label><input type="number" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: parseInt(e.target.value) })} min="1" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
