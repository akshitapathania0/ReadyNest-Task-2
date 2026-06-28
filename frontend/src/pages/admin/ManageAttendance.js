import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';

const SUBJECTS = [
  'Data Structures',
  'Operating Systems',
  'Computer Networks',
  'Database Management',
  'Software Engineering',
];

const pct = (r) => (r.total > 0 ? Math.round((r.present / r.total) * 100) : 0);
const getColor = (p) => (p >= 75 ? 'var(--green)' : p >= 60 ? 'var(--yellow)' : 'var(--red)');
const getLabel = (p) => (p >= 75 ? 'Safe' : p >= 60 ? 'At Risk' : 'Critical');

export default function ManageAttendance() {
  const [allData, setAllData]         = useState([]); // [{ student, records }]
  const [selectedId, setSelectedId]   = useState('');
  const [marking, setMarking]         = useState({}); // subject -> 'present'|'absent'|null
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState('');
  const [editMode, setEditMode]       = useState(false);
  const [editValues, setEditValues]   = useState({}); // subject -> { present, total }

  const load = useCallback(() => {
    api.get('/attendance/all').then(r => {
      setAllData(r.data);
      if (!selectedId && r.data.length > 0) setSelectedId(r.data[0].student.id);
    });
  }, [selectedId]);

  useEffect(() => { load(); }, []);

  const selected = allData.find(d => d.student.id === selectedId);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Mark a single class (present / absent)
  const markClass = async (subject, present) => {
    if (!selectedId) return;
    setMarking(m => ({ ...m, [subject]: present ? 'present' : 'absent' }));
    try {
      await api.post('/attendance/mark', { studentId: selectedId, subject, present });
      await load();
      showToast(`Marked ${present ? '✅ Present' : '❌ Absent'} for ${subject}`);
    } catch {
      showToast('Failed to save. Try again.');
    } finally {
      setMarking(m => ({ ...m, [subject]: null }));
    }
  };

  // Bulk edit (set raw totals)
  const startEdit = () => {
    const vals = {};
    SUBJECTS.forEach(s => {
      const rec = selected?.records.find(r => r.subject === s) || { present: 0, total: 0 };
      vals[s] = { present: rec.present, total: rec.total };
    });
    setEditValues(vals);
    setEditMode(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await Promise.all(
        SUBJECTS.map(s =>
          api.put(`/attendance/${selectedId}`, {
            subject: s,
            present: Number(editValues[s].present),
            total: Number(editValues[s].total),
          })
        )
      );
      await load();
      setEditMode(false);
      showToast('✅ Attendance updated successfully!');
    } catch {
      showToast('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── render ── */
  const cardStyle = { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', animation: 'fadeIn .2s ease'
        }}>{toast}</div>
      )}

      <div className="page-header">
        <div>
          <h2>Manage Attendance</h2>
          <p>Mark classes and edit attendance records for any student</p>
        </div>
      </div>

      {/* Student selector */}
      <div style={{ ...cardStyle, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Select Student</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {allData.map(({ student: s }) => (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setEditMode(false); }}
              style={{
                padding: '7px 14px', borderRadius: 8, border: '1px solid',
                borderColor: selectedId === s.id ? 'var(--primary)' : 'var(--border)',
                background: selectedId === s.id ? 'rgba(99,102,241,.12)' : 'transparent',
                color: selectedId === s.id ? 'var(--primary)' : 'var(--text)',
                fontWeight: selectedId === s.id ? 600 : 400,
                fontSize: 13, cursor: 'pointer', transition: 'all .15s',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--primary-dim)', color: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700
              }}>{s.avatar}</span>
              {s.name}
              {s.rollNo && <span style={{ fontSize: 11, color: 'var(--text3)' }}>{s.rollNo}</span>}
            </button>
          ))}
          {allData.length === 0 && <span style={{ color: 'var(--text3)', fontSize: 13 }}>No students found.</span>}
        </div>
      </div>

      {selected && (
        <>
          {/* Header row with overall % and Edit toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontWeight: 600 }}>{selected.student.name}</span>
              {selected.student.course && (
                <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 10 }}>{selected.student.course} · Sem {selected.student.semester}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {editMode ? (
                <>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={saveEdit} disabled={saving}>
                    {saving ? 'Saving…' : '💾 Save Changes'}
                  </button>
                </>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={startEdit}>✏️ Edit Totals</button>
              )}
            </div>
          </div>

          {/* Subject cards */}
          <div className="grid-2" style={{ gap: 14 }}>
            {SUBJECTS.map(subject => {
              const rec = selected.records.find(r => r.subject === subject) || { subject, present: 0, total: 0, percentage: 0 };
              const p = pct(rec);
              const col = getColor(p);

              return (
                <div key={subject} style={cardStyle}>
                  {/* Subject name + badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{subject}</div>
                      {!editMode && (
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                          {rec.present} / {rec.total} classes attended
                        </div>
                      )}
                    </div>
                    <span className="badge" style={{ background: `${col}20`, color: col }}>
                      {p}% · {getLabel(p)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {!editMode && (
                    <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                      <div style={{ height: '100%', width: `${p}%`, background: col, borderRadius: 4, transition: 'width .6s ease' }} />
                    </div>
                  )}

                  {/* EDIT MODE: raw number inputs */}
                  {editMode ? (
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Classes Present</label>
                        <input
                          type="number" min="0"
                          value={editValues[subject]?.present ?? 0}
                          onChange={e => setEditValues(v => ({ ...v, [subject]: { ...v[subject], present: e.target.value } }))}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13 }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 4 }}>Total Classes</label>
                        <input
                          type="number" min="0"
                          value={editValues[subject]?.total ?? 0}
                          onChange={e => setEditValues(v => ({ ...v, [subject]: { ...v[subject], total: e.target.value } }))}
                          style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13 }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* MARK MODE: Present / Absent buttons */
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => markClass(subject, true)}
                        disabled={marking[subject] != null}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--green)',
                          background: 'rgba(52,211,153,.08)', color: 'var(--green)',
                          fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
                          opacity: marking[subject] != null ? 0.6 : 1
                        }}
                      >
                        {marking[subject] === 'present' ? '…' : '✅ Present'}
                      </button>
                      <button
                        onClick={() => markClass(subject, false)}
                        disabled={marking[subject] != null}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--red)',
                          background: 'rgba(248,113,113,.08)', color: 'var(--red)',
                          fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
                          opacity: marking[subject] != null ? 0.6 : 1
                        }}
                      >
                        {marking[subject] === 'absent' ? '…' : '❌ Absent'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall summary bar */}
          {selected.records.length > 0 && !editMode && (() => {
            const overall = Math.round(selected.records.reduce((s, r) => s + pct(r), 0) / selected.records.length);
            return (
              <div style={{ ...cardStyle, marginTop: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: getColor(overall) }}>{overall}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>Overall</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${overall}%`, background: getColor(overall), borderRadius: 5 }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                    {overall >= 75 ? '✅ Student meets the 75% requirement.' : overall >= 60 ? '⚠️ Student is at risk — below 75%.' : '🚨 Critical — attendance needs immediate attention.'}
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
