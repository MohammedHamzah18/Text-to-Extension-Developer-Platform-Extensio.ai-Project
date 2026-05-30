import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExtension, updateExtension, generateExtension, saveVersion } from '../services/extensionService';
import { getTemplate } from '../services/templateService';
import { Download, Eye, Save } from 'lucide-react';

export default function ExtensionEditPage() {
  const { id } = useParams();
  const [ext, setExt] = useState(null);
  const [template, setTemplate] = useState(null);
  const [settings, setSettings] = useState({});
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExtension(id).then(({ data }) => {
      setExt(data.data);
      setName(data.data.name);
      setSettings(data.data.settings || {});
      return getTemplate(data.data.templateId);
    }).then((res) => setTemplate(res?.data?.data));
  }, [id]);

  const handleSave = async () => {
    const { data } = await updateExtension(id, { name, settings });
    setExt(data.data);
    setMsg('Saved');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setMsg('');
    try {
      await handleSave();
      const { data } = await generateExtension(id);
      setExt(data.data);
      setMsg('ZIP generated! ' + (data.validationReport?.valid ? 'Validation passed.' : ''));
    } catch (err) {
      setMsg(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVersion = async () => {
    await saveVersion(id, `Manual save v${ext?.version}`);
    const { data } = await getExtension(id);
    setExt(data.data);
    setMsg('Version saved');
  };

  if (!ext) return <p className="text-slate-400">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Edit: {ext.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to={`/preview/${id}`} className="btn-secondary gap-2">
            <Eye className="h-4 w-4" /> Preview
          </Link>
          <button type="button" onClick={handleVersion} className="btn-secondary gap-2">
            <Save className="h-4 w-4" /> Save Version
          </button>
          <button type="button" onClick={handleGenerate} className="btn-primary gap-2" disabled={loading}>
            <Download className="h-4 w-4" />
            {loading ? 'Generating…' : 'Generate ZIP'}
          </button>
        </div>
      </div>
      {msg && <p className="text-sm text-brand-300">{msg}</p>}
      {ext.zipUrl && (
        <a href={ext.zipUrl} download className="btn-primary inline-flex">
          Download ZIP
        </a>
      )}
      <div className="card space-y-4">
        <div>
          <label className="text-sm text-slate-400">Name</label>
          <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        {template?.fields?.map((field) => (
          <div key={field.key}>
            <label className="text-sm text-slate-400">{field.label}</label>
            <SettingField field={field} value={settings[field.key]} onChange={(v) => setSettings({ ...settings, [field.key]: v })} />
          </div>
        ))}
        <button type="button" onClick={handleSave} className="btn-secondary">
          Save Changes
        </button>
      </div>
      {ext.versions?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold">Version History</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-400">
            {ext.versions.map((v) => (
              <li key={v._id}>
                {v.label || `v${v.version}`} — {new Date(v.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SettingField({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return <input type="checkbox" className="mt-2" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
  }
  if (field.type === 'color') {
    return <input type="color" className="mt-2 h-10 w-full" value={value || '#000'} onChange={(e) => onChange(e.target.value)} />;
  }
  if (field.type === 'textarea') {
    return <textarea className="input-field mt-1" rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  if (field.type === 'number') {
    return <input type="number" className="input-field mt-1" value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))} />;
  }
  return <input className="input-field mt-1" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
}
