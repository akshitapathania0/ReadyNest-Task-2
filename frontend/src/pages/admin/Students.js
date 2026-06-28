import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => { api.get('/students').then(r => setStudents(r.data)); }, []);

  const viewAttendance = async (s) => {
    setSelected(s);
    const r = await api.get(`/attendance?studentId=${s.id}`);
    setAttendance(r.data);
  };

  const getColor = (p) => p >= 75 ? 'var(--green)' : p >= 60 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div>
      <div className="page-header">
        <div><h2>Students</h2><p>{students.length} enrolled</p></div>
      </div>

      <div className="grid-2" style={{ gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {students.map(s => (
            <div key={s.id} className="card" style={{ cursor: 'pointer', border: selected?.id === s.id ? '1px solid var(--primary)' : '1px solid var(--border)' }} onClick={() => viewAttendance(s)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'var(--primary-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>
                  {s.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.rollNo} · Sem {s.semester}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>{selected.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>Attendance Report</p>
            {attendance.map(a => (
              <div key={a.subject} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{a.subject}</span>
                  <span style={{ color: getColor(a.percentage), fontWeight: 600 }}>{a.percentage}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.percentage}%`, background: getColor(a.percentage), borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{a.present}/{a.total} classes</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
