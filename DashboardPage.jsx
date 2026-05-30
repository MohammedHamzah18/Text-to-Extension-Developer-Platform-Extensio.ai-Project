import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Puzzle, Search, Plus, Eye, Trash2, Copy } from 'lucide-react';
import { useExtensions } from '../hooks/useExtensions';
import StatsCard from '../components/StatsCard';
import * as extensionService from '../services/extensionService';

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const { extensions, total, loading, refetch } = useExtensions({ search: search || undefined });

  const handleDelete = async (id) => {
    if (!confirm('Delete this extension?')) return;
    await extensionService.deleteExtension(id);
    refetch();
  };

  const handleClone = async (id) => {
    await extensionService.cloneExtension(id);
    refetch();
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400">Manage your Chrome extensions</p>
        </div>
        <Link to="/builder" className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          New Extension
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Extensions" value={total} icon={Puzzle} />
        <StatsCard title="Categories" value={new Set(extensions.map((e) => e.category)).size} accent="emerald" />
        <StatsCard title="With ZIP" value={extensions.filter((e) => e.zipUrl).length} accent="amber" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          className="input-field pl-10"
          placeholder="Search extensions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : extensions.length === 0 ? (
        <div className="card text-center">
          <Puzzle className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-4 text-slate-400">No extensions yet. Create your first one!</p>
          <Link to="/builder" className="btn-primary mt-4 inline-flex">
            Start Building
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {extensions.map((ext) => (
            <div key={ext._id} className="card flex flex-col">
              <div className="flex-1">
                <span className="rounded-full bg-brand-600/20 px-2 py-0.5 text-xs text-brand-300">
                  {ext.category}
                </span>
                <h3 className="mt-2 font-semibold">{ext.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{ext.description || ext.templateId}</p>
                <p className="mt-2 text-xs text-slate-500">v{ext.version} · {ext.templateId}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-700 pt-4">
                <Link to={`/builder/${ext._id}`} className="btn-secondary flex-1 text-center text-xs py-2">
                  Edit
                </Link>
                <Link to={`/preview/${ext._id}`} className="btn-secondary p-2" title="Preview">
                  <Eye className="h-4 w-4" />
                </Link>
                <button type="button" onClick={() => handleClone(ext._id)} className="btn-secondary p-2" title="Clone">
                  <Copy className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleDelete(ext._id)} className="btn-secondary p-2 text-red-400" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
