import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    const { data } = await updateProfile({ name });
    setUser(data.user);
    setMsg('Profile updated');
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="text-sm text-slate-400">Email</label>
          <input className="input-field mt-1 opacity-60" value={user?.email || ''} disabled />
        </div>
        <div>
          <label className="text-sm text-slate-400">Display Name</label>
          <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <p className="text-xs text-slate-500">Role: {user?.role}</p>
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
