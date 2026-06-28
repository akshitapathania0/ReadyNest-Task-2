import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Attendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => { api.get('/attendance').then(r => setRecords(r.data)); }, []);

  const overall = records.length ? Math.round(records.reduce((s, r) => s + r.percentage, 0) / records.length) : 0;

  const getColor = (p) => p >= 75 ? 'var(--green)' : p >= 60 ? 'var(--yellow)' : 'var(--red)';
  const getLabel = (p) => p >= 75 ? 'Safe' : p >= 60 ? 'At Risk' : 'Critical';

  return (
    <div>
      <div className="page-header">
        <div><h2>Attendance</h2><p>Subject-wise attendance tracking</p></div>
      </div>

      {/* Overall */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center', minWidth: 100 }}>
          <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: getColor(overall) }}>{overall}%</div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>Overall Attendance</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, background: 'var(--bg3)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${overall}%`, background: getColor(overall), borderRadius: 6, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>
            {overall >= 75 ? '✅ You have safe attendance across all subjects.' : overall >= 60 ? '⚠️ Some subjects need attention. Attend more classes.' : '🚨 Critical! Your attendance is below the required 75%.'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Minimum required: 75%</div>
        </div>
      </div>

      {/* Subject cards */}
      <div className="grid-2" style={{ gap: 14 }}>
        {records.map(r => (
          <div key={r.subject} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 14 }}>{r.subject}</h3>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{r.present} / {r.total} classes attended</div>
              </div>
              <span className="badge" style={{ background: `${getColor(r.percentage)}20`, color: getColor(r.percentage) }}>{getLabel(r.percentage)}</span>
            </div>
            <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${r.percentage}%`, background: getColor(r.percentage), borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)' }}>
              <span>{r.percentage}%</span>
              {r.percentage < 75 && <span style={{ color: 'var(--red)' }}>Need {Math.ceil((0.75 * r.total - r.present) / 0.25)} more classes</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
