import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/api.js';

export default function CompanyProfile(){
  const { user, setUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [error, setError] = useState('');
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const initials = (user?.name || 'C').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  const onSave = async () => {
    setError('');
    setSaving(true);
    try {
      if (pwd.newPassword && pwd.newPassword !== pwd.confirmPassword) {
        setError('New passwords do not match');
        setSaving(false);
        return;
      }

      const payload = { name: form.name };
      if (pwd.newPassword) {
        payload.currentPassword = pwd.currentPassword;
        payload.newPassword = pwd.newPassword;
      }

      const { data } = await api.put('/auth/update', payload);
      setUser?.(data.user);
      setEdit(false);
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

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
              <h1 className="text-2xl font-semibold">Company Profile</h1>
              <p className="text-white/90">Manage your account information</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Account</h2>
              {!edit ? (
                <button className="text-brand-600 hover:underline" onClick={()=>setEdit(true)}>Edit</button>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded border" onClick={()=>{ setEdit(false); setForm({ name: user?.name || '', email: user?.email || '' }); }}>Cancel</button>
                  <button disabled={saving} className="px-4 py-2 rounded bg-brand-600 text-white" onClick={onSave}>{saving? 'Saving...' : 'Save'}</button>
                </div>
              )}
            </div>
            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

            {!edit ? (
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
                  <input className="border rounded-md px-3 py-2" value={form.name} onChange={e=>setForm(s=>({ ...s, name: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Email</span>
                  <input className="border rounded-md px-3 py-2 bg-gray-50" value={form.email} readOnly />
                </label>
                <div className="pt-2 border-t mt-2">
                  <div className="text-sm font-medium text-gray-900 mb-2">Change Password</div>
                  <p className="text-xs text-gray-500 mb-3">Leave blank to keep current password</p>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">Current password</span>
                    <input className="border rounded-md px-3 py-2" type="password" value={pwd.currentPassword} onChange={e=>setPwd(s=>({ ...s, currentPassword: e.target.value }))} />
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-gray-700">New password</span>
                      <input className="border rounded-md px-3 py-2" type="password" value={pwd.newPassword} onChange={e=>setPwd(s=>({ ...s, newPassword: e.target.value }))} />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-gray-700">Confirm new password</span>
                      <input className="border rounded-md px-3 py-2" type="password" value={pwd.confirmPassword} onChange={e=>setPwd(s=>({ ...s, confirmPassword: e.target.value }))} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-4">Organization</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>ID</span><span className="text-gray-900 font-medium">{user?.id || '—'}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="text-gray-900 font-medium">Active</span></div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
