import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ManageTimetable() {
  const [timetable, setTimetable] = useState({});
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ day: 'Monday', startTime: '', endTime: '', subject: '', teacher: '', room: '', semester: 5 });

  const load = () => api.get('/timetable').then(r => setTimetable(r.data));
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.startTime || !form.endTime || !form.subject) return alert('Fill required fields');
    await api.post('/timetable', form);
    await load();
    setModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this class?')) return;
    await api.delete(`/timetable/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Manage Timetable</h2><p>Semester 5 schedule</p></div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Add Class</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {DAYS.map(day => (
          <div key={day}>
            <h3 style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} />
              {day}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(timetable[day] || []).map(slot => (
                <div key={slot.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text2)', minWidth: 100 }}>{slot.startTime} – {slot.endTime}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{slot.subject}</span>
                    {slot.teacher && <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 8 }}>· {slot.teacher}</span>}
                    {slot.room && <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 8 }}>· {slot.room}</span>}
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(slot.id)}>✕</button>
                </div>
              ))}
              {(timetable[day] || []).length === 0 && <p style={{ fontSize: 13, color: 'var(--text3)', padding: '4px 0' }}>No classes scheduled</p>}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Add Class</h3><button className="btn btn-ghost btn-sm" onClick={() => setModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label>Day</label><select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>{DAYS.map(d => <option key={d}>{d}</option>)}</select></div>
              <div className="grid-2">
                <div className="form-group"><label>Start Time *</label><input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></div>
                <div className="form-group"><label>End Time *</label><input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Subject *</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Data Structures" /></div>
              <div className="form-group"><label>Teacher</label><input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} placeholder="Prof. Name" /></div>
              <div className="form-group"><label>Room</label><input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="e.g. LH-201" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Add Class</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
