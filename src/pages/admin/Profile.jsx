import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/api.js';

export default function AdminProfile(){
  const { user, setUser } = useAuth();

  const [nameEdit, setNameEdit] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [nameForm, setNameForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [nameError, setNameError] = useState('');

  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailForm, setEmailForm] = useState({ email: user?.email || '' });

  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    setNameForm({ name: user?.name || '', email: user?.email || '' });
    setEmailForm({ email: user?.email || '' });
  }, [user]);

  const initials = (user?.name || 'A').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  const saveName = async () => {
    setNameError(''); setNameSaving(true);
    try {
      const { data } = await api.put('/auth/update', { name: nameForm.name });
      setUser?.(data.user);
      setNameEdit(false);
    } catch (e) {
      setNameError(e?.response?.data?.message || 'Failed to update name');
    } finally { setNameSaving(false); }
  };

  const saveEmail = async () => {
    setEmailError(''); setEmailSaving(true);
    try {
      const { data } = await api.put('/auth/update', { email: emailForm.email });
      setUser?.(data.user);
    } catch (e) {
      setEmailError(e?.response?.data?.message || 'Failed to update email');
    } finally { setEmailSaving(false); }
  };

  const savePassword = async () => {
    setPwdError('');
    if (!pwd.newPassword) { setPwdError('New password is required'); return; }
    if (pwd.newPassword !== pwd.confirmPassword) { setPwdError('New passwords do not match'); return; }
    setPwdSaving(true);
    try {
      await api.put('/auth/update', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setPwdError(e?.response?.data?.message || 'Failed to update password');
    } finally { setPwdSaving(false); }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {!user ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-600">Loading profile...</div>
      ) : (
      <div className="overflow-hidden rounded-2xl shadow-lg bg-white">
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/15 grid place-items-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Admin Profile</h1>
              <p className="text-white/90">Manage your admin account</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Account card (name) */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Account</h2>
              {!nameEdit ? (
                <button className="text-brand-600 hover:underline" onClick={()=>setNameEdit(true)}>Edit</button>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded border" onClick={()=>{ setNameEdit(false); setNameForm({ name: user?.name || '', email: user?.email || '' }); }}>Cancel</button>
                  <button disabled={nameSaving} className="px-4 py-2 rounded bg-brand-600 text-white" onClick={saveName}>{nameSaving? 'Saving...' : 'Save'}</button>
                </div>
              )}
            </div>
            {nameError && <div className="text-sm text-red-600 mb-3">{nameError}</div>}

            {!nameEdit ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium">{user?.name || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{user?.email || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Role</div>
                  <div className="font-medium">{user?.role || '-'}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Name</span>
                  <input className="border rounded-md px-3 py-2" value={nameForm.name} onChange={e=>setNameForm(s=>({ ...s, name: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Email</span>
                  <input className="border rounded-md px-3 py-2 bg-gray-50" value={nameForm.email} readOnly />
                </label>
              </div>
            )}
          </div>

          {/* Email update card */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-4">Update Email</h2>
            {emailError && <div className="text-sm text-red-600 mb-3">{emailError}</div>}
            <div className="space-y-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">New email</span>
                <input className="border rounded-md px-3 py-2" type="email" value={emailForm.email} onChange={e=>setEmailForm({ email: e.target.value })} />
              </label>
              <div className="flex justify-end">
                <button disabled={emailSaving} className="px-4 py-2 rounded bg-brand-600 text-white" onClick={saveEmail}>{emailSaving ? 'Saving...' : 'Save Email'}</button>
              </div>
            </div>
          </div>

          {/* Password update card */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-4">Change Password</h2>
            {pwdError && <div className="text-sm text-red-600 mb-3">{pwdError}</div>}
            <div className="space-y-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-700">Current password</span>
                <input className="border rounded-md px-3 py-2" type="password" value={pwd.currentPassword} onChange={e=>setPwd(s=>({ ...s, currentPassword: e.target.value }))} />
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">New password</span>
                  <input className="border rounded-md px-3 py-2" type="password" value={pwd.newPassword} onChange={e=>setPwd(s=>({ ...s, newPassword: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Confirm new password</span>
                  <input className="border rounded-md px-3 py-2" type="password" value={pwd.confirmPassword} onChange={e=>setPwd(s=>({ ...s, confirmPassword: e.target.value }))} />
                </label>
              </div>
              <div className="flex justify-end">
                <button disabled={pwdSaving} className="px-4 py-2 rounded bg-brand-600 text-white" onClick={savePassword}>{pwdSaving ? 'Saving...' : 'Update Password'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
