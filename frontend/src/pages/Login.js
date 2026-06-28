import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEMO = [
  { label: 'Admin', email: 'admin@unitrack.edu', password: 'admin123' },
  { label: 'Student', email: 'rahul@unitrack.edu', password: 'student123' },
];

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('student'); // 'student' | 'admin'

  // shared fields
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // student-only extras
  const [course, setCourse]     = useState('');
  const [semester, setSemester] = useState('');
  const [rollNo, setRollNo]     = useState('');

  // admin-only extras
  const [department, setDepartment] = useState('');

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const reset = () => {
    setName(''); setEmail(''); setPassword(''); setConfirm('');
    setCourse(''); setSemester(''); setRollNo(''); setDepartment('');
    setError('');
  };

  const switchMode = (m) => { setMode(m); reset(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (password !== confirm) return setError('Passwords do not match.');
      if (password.length < 6)  return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      let user;
      if (mode === 'login') {
        user = await login(email, password);
      } else {
        user = await signup({ name, email, password, role, department, course, semester, rollNo });
      }
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        (mode === 'login' ? 'Invalid email or password.' : 'Sign up failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (d) => { setEmail(d.email); setPassword(d.password); setError(''); };

  /* ── styles ─────────────────────────────────────────────── */
  const tabStyle = (active) => ({
    flex: 1,
    padding: '10px 0',
    border: 'none',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    background: 'transparent',
    color: active ? 'var(--primary)' : 'var(--text2)',
    fontWeight: active ? 600 : 400,
    fontSize: 15,
    cursor: 'pointer',
    transition: 'all .2s',
  });

  const roleBtn = (r) => ({
    flex: 1,
    padding: '9px 0',
    borderRadius: 8,
    border: role === r ? '2px solid var(--primary)' : '2px solid var(--border)',
    background: role === r ? 'rgba(99,102,241,.12)' : 'transparent',
    color: role === r ? 'var(--primary)' : 'var(--text2)',
    fontWeight: role === r ? 600 : 400,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all .2s',
  });

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px' }}>🎓</div>
          <h1 style={{ fontSize: 26, fontFamily: 'Space Grotesk, sans-serif' }}>UniTrack</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4, fontSize: 13 }}>Smart Campus Management Platform</p>
        </div>

        {/* Demo fill buttons (login only) */}
        {mode === 'login' && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {DEMO.map(d => (
              <button key={d.label} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => fillDemo(d)}>
                {d.label === 'Admin' ? '🛡️' : '🎒'} {d.label} Demo
              </button>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            <button style={tabStyle(mode === 'login')}  onClick={() => switchMode('login')}>Sign In</button>
            <button style={tabStyle(mode === 'signup')} onClick={() => switchMode('signup')}>Create Account</button>
          </div>

          <div style={{ padding: 28 }}>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: 'var(--red)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* ── SIGN-UP EXTRAS ── */}
              {mode === 'signup' && (
                <>
                  {/* Role selector */}
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>I am a</label>
                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                      <button type="button" style={roleBtn('student')} onClick={() => setRole('student')}>🎒 Student</button>
                      <button type="button" style={roleBtn('admin')}   onClick={() => setRole('admin')}>🛡️ Admin</button>
                    </div>
                  </div>

                  {/* Full name */}
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Verma" required />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@unitrack.edu" required />
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>

              {/* Confirm password (signup only) */}
              {mode === 'signup' && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
                </div>
              )}

              {/* Role-specific fields (signup only) */}
              {mode === 'signup' && role === 'student' && (
                <>
                  <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0 14px', paddingTop: 14 }}>
                    <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>STUDENT DETAILS <span style={{ color: 'var(--text3)' }}>(optional)</span></p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Course</label>
                        <input type="text" value={course} onChange={e => setCourse(e.target.value)} placeholder="e.g. B.Tech CSE" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Semester</label>
                        <input type="number" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g. 5" min="1" max="12" />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: 12 }}>
                      <label>Roll Number</label>
                      <input type="text" value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="e.g. CSE2021045" />
                    </div>
                  </div>
                </>
              )}

              {mode === 'signup' && role === 'admin' && (
                <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0 14px', paddingTop: 14 }}>
                  <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>ADMIN DETAILS <span style={{ color: 'var(--text3)' }}>(optional)</span></p>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Computer Science" />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 6 }}
                disabled={loading}
              >
                {loading
                  ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
                  : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
              </button>

            </form>

            {/* Mode switch link */}
            <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text2)' }}>
              {mode === 'login'
                ? <>Don't have an account?{' '}<button className="btn-link" onClick={() => switchMode('signup')} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create one</button></>
                : <>Already have an account?{' '}<button className="btn-link" onClick={() => switchMode('login')} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign in</button></>
              }
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
