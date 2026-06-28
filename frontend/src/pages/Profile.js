import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid var(--border)', background: 'var(--bg)',
  color: 'var(--text)', fontSize: 14, boxSizing: 'border-box',
};

const labelStyle = { fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 5, fontWeight: 500 };

function Field({ label, type = 'text', value, onChange, placeholder, readOnly }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} readOnly={readOnly}
        style={{ ...inputStyle, opacity: readOnly ? 0.6 : 1, cursor: readOnly ? 'not-allowed' : 'text' }}
      />
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName]               = useState(user?.name || '');
  const [email, setEmail]             = useState(user?.email || '');
  const [department, setDepartment]   = useState(user?.department || '');
  const [course, setCourse]           = useState(user?.course || '');
  const [semester, setSemester]       = useState(user?.semester || '');
  const [rollNo, setRollNo]           = useState(user?.rollNo || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email, department, course, semester, rollNo });
      showToast('✅ Profile updated successfully!');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to update profile.', 'error');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showToast('New passwords do not match.', 'error');
    if (newPassword.length < 6) return showToast('Password must be at least 6 characters.', 'error');
    setSaving(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      showToast('✅ Password changed successfully!');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to change password.', 'error');
    } finally { setSaving(false); }
  };

  const cardStyle = {
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 14, padding: 24, marginBottom: 20,
  };

  const toastColor = toast.type === 'error' ? 'var(--red)' : 'var(--green)';
  const toastBg    = toast.type === 'error' ? 'rgba(248,113,113,.1)' : 'rgba(52,211,153,.1)';
  const toastBorder = toast.type === 'error' ? 'rgba(248,113,113,.3)' : 'rgba(52,211,153,.3)';

  return (
    <div style={{ maxWidth: 620 }}>
      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toastBg, border: `1px solid ${toastBorder}`,
          color: toastColor, borderRadius: 10, padding: '12px 20px',
          fontSize: 14, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,.25)',
        }}>{toast.msg}</div>
      )}

      <div className="page-header">
        <div><h2>My Profile</h2><p>Update your personal information and password</p></div>
      </div>

      {/* Avatar + role badge */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--primary-dim)', border: '2px solid var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: 'var(--primary-light)', flexShrink: 0,
        }}>
          {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Space Grotesk, sans-serif' }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>{user?.email}</div>
          <span className="badge" style={{
            marginTop: 8, display: 'inline-block',
            background: user?.role === 'admin' ? 'rgba(167,139,250,.15)' : 'rgba(99,102,241,.15)',
            color: user?.role === 'admin' ? '#a78bfa' : 'var(--primary-light)',
          }}>
            {user?.role === 'admin' ? '🛡️ Admin' : '🎒 Student'}
          </span>
        </div>
      </div>

      {/* Personal info form */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 20, fontSize: 15 }}>Personal Information</h3>
        <form onSubmit={handleSaveInfo}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            <Field label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@unitrack.edu" />
          </div>

          <Field label="Role" value={user?.role === 'admin' ? 'Admin' : 'Student'} readOnly />

          {/* Admin fields */}
          {user?.role === 'admin' && (
            <Field label="Department" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science" />
          )}

          {/* Student fields */}
          {user?.role === 'student' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Field label="Course" value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. B.Tech CSE" />
                <Field label="Semester" type="number" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g. 5" />
              </div>
              <Field label="Roll Number" value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="e.g. CSE2021045" />
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 4, padding: '10px 24px' }}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password form */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: 4, fontSize: 15 }}>Change Password</h3>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 20 }}>Leave blank if you don't want to change your password.</p>
        <form onSubmit={handleChangePassword}>
          <Field
            label="Current Password" type="password"
            value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field
              label="New Password" type="password"
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
            />
            <Field
              label="Confirm New Password" type="password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 4, padding: '10px 24px' }}
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          >
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
