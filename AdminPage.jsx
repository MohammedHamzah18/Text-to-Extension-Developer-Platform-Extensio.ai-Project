import { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';
import StatsCard from '../components/StatsCard';
import { Users, Puzzle, Download, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    adminService.getStats().then(({ data }) => setStats(data.stats));
    adminService.listUsers().then(({ data }) => setUsers(data.data));
    adminService.listAllExtensions().then(({ data }) => setExtensions(data.data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this extension permanently?')) return;
    await adminService.deleteExtensionAdmin(id);
    setExtensions((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <StatsCard title="Users" value={stats.users} icon={Users} />
          <StatsCard title="Extensions" value={stats.extensions} icon={Puzzle} accent="emerald" />
          <StatsCard title="Download Records" value={stats.downloadRecords} icon={Download} accent="amber" />
          <StatsCard title="Total Downloads" value={stats.totalDownloads} />
        </div>
      )}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {['overview', 'users', 'extensions'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-3 py-1 text-sm capitalize ${tab === t ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2">Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-700">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'extensions' && (
        <div className="space-y-2">
          {extensions.map((e) => (
            <div key={e._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-slate-400">
                  {e.userId?.email} · {e.templateId} {e.isFlagged && '· FLAGGED'}
                </p>
              </div>
              <button type="button" onClick={() => handleDelete(e._id)} className="text-red-400">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
