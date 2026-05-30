import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { previewExtension, generateExtension } from '../services/extensionService';
import { recordDownload } from '../services/downloadService';
import CodePreview from '../components/CodePreview';
import ValidationReport from '../components/ValidationReport';

export default function PreviewPage() {
  const { id } = useParams();
  const [files, setFiles] = useState({});
  const [folderStructure, setFolderStructure] = useState(null);
  const [validationReport, setValidationReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPreview = () => {
    setLoading(true);
    previewExtension(id)
      .then(({ data }) => {
        setFiles(data.files);
        setFolderStructure(data.folderStructure);
        setValidationReport(data.validationReport);
      })
      .catch((err) => setError(err.response?.data?.message || 'Preview failed'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPreview();
  }, [id]);

  const handleDownload = async () => {
    try {
      const { data } = await generateExtension(id);
      await recordDownload(id);
      window.location.href = data.zipUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed');
    }
  };

  if (loading) return <p className="text-slate-400">Generating preview…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Code Preview</h1>
        <div className="flex gap-2">
          <Link to={`/builder/${id}`} className="btn-secondary">
            ← Edit
          </Link>
          <button type="button" onClick={loadPreview} className="btn-secondary">
            Refresh
          </button>
          <button type="button" onClick={handleDownload} className="btn-primary" disabled={!validationReport?.valid}>
            Download ZIP
          </button>
        </div>
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <ValidationReport report={validationReport} />
      <CodePreview files={files} folderStructure={folderStructure} />
    </div>
  );
}
