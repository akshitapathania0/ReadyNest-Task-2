import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const COLORS = { 'Data Structures': '#7c6af7', 'Operating Systems': '#f06292', 'Computer Networks': '#4ade80', 'Database Management': '#fbbf24', 'Software Engineering': '#60a5fa', 'DBMS Lab': '#fb923c', 'Networks Lab': '#a78bfa', 'DS Lab': '#34d399' };

export default function Timetable() {
  const [timetable, setTimetable] = useState({});
  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  useEffect(() => { api.get('/timetable').then(r => setTimetable(r.data)); }, []);

  return (
    <div>
      <div className="page-header">
        <div><h2>Weekly Timetable</h2><p>Semester 5 schedule</p></div>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {DAYS.map(day => (
          <div key={day} style={{ minWidth: 200, flex: 1 }}>
            <div style={{
              padding: '10px 14px', marginBottom: 10, borderRadius: 8, textAlign: 'center',
              background: day === today ? 'var(--primary-dim)' : 'var(--bg2)',
              border: `1px solid ${day === today ? 'var(--primary)' : 'var(--border)'}`,
              color: day === today ? 'var(--primary-light)' : 'var(--text2)',
              fontWeight: 600, fontSize: 13
            }}>
              {day} {day === today && '• Today'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(timetable[day] || []).map(slot => {
                const color = COLORS[slot.subject] || '#7c6af7';
                return (
                  <div key={slot.id} style={{
                    padding: '10px 12px', borderRadius: 8,
                    borderLeft: `3px solid ${color}`,
                    background: `${color}12`
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 3 }}>
                      {slot.startTime} – {slot.endTime}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color }}>{slot.subject}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
                      {slot.teacher} · {slot.room}
                    </div>
                  </div>
                );
              })}
              {(timetable[day] || []).length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: 12 }}>No classes</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
