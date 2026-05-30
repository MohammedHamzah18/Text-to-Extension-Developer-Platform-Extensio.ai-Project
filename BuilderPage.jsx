import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTemplates } from '../services/templateService';
import { createExtension } from '../services/extensionService';

const CATEGORIES = [
  { id: 'content-modifier', label: 'Content Modifier' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'utility', label: 'Utility' },
];

export default function BuilderPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [category, setCategory] = useState('');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', description: '', templateId: '', settings: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listTemplates(category || undefined).then(({ data }) => setTemplates(data.data));
  }, [category]);

  const selectedTemplate = templates.find((t) => t.id === form.templateId);

  const handleSelectTemplate = (t) => {
    const settings = {};
    t.fields?.forEach((f) => {
      settings[f.key] = f.default;
    });
    setForm((prev) => ({ ...prev, templateId: t.id, settings, category: t.category }));
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await createExtension({
        name: form.name,
        description: form.description,
        category: form.category || selectedTemplate?.category,
        templateId: form.templateId,
        settings: form.settings,
      });
      navigate(`/builder/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-slide-up">
      <h1 className="text-2xl font-bold">Extension Builder</h1>
      <div className="flex gap-2 text-sm">
        {[1, 2, 3].map((s) => (
          <span key={s} className={step >= s ? 'text-brand-400' : 'text-slate-600'}>
            Step {s}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="font-semibold">Choose category</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.id);
                  setStep(2);
                }}
                className="rounded-lg border border-slate-600 p-4 text-left hover:border-brand-500 hover:bg-brand-600/10"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-4">
          <button type="button" className="text-sm text-brand-400" onClick={() => setStep(1)}>
            ← Back
          </button>
          <h2 className="font-semibold">Select template</h2>
          <div className="grid gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTemplate(t)}
                className="rounded-lg border border-slate-600 p-4 text-left hover:border-brand-500"
              >
                <span className="font-medium">{t.name}</span>
                <p className="mt-1 text-sm text-slate-400">{t.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && selectedTemplate && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <button type="button" className="text-sm text-brand-400" onClick={() => setStep(2)}>
            ← Back
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label className="text-sm text-slate-400">Extension Name</label>
            <input
              className="input-field mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Image Blocker"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Description</label>
            <textarea
              className="input-field mt-1"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {selectedTemplate.fields?.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={form.settings[field.key]}
              onChange={(v) =>
                setForm({ ...form, settings: { ...form.settings, [field.key]: v } })
              }
            />
          ))}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create & Configure'}
          </button>
        </form>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  const common = { className: 'input-field mt-1', value: value ?? '', onChange: (e) => onChange(e.target.value) };
  return (
    <div>
      <label className="text-sm text-slate-400">{field.label}</label>
      {field.type === 'boolean' ? (
        <input
          type="checkbox"
          className="mt-2"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
      ) : field.type === 'color' ? (
        <input type="color" className="mt-2 h-10 w-full cursor-pointer" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'textarea' ? (
        <textarea {...common} rows={4} />
      ) : field.type === 'number' ? (
        <input type="number" {...common} onChange={(e) => onChange(Number(e.target.value))} />
      ) : (
        <input type="text" {...common} />
      )}
    </div>
  );
}
