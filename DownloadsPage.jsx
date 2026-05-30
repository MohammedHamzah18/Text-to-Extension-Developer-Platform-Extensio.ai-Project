import { useEffect, useState } from 'react';
import { getDownloads } from '../services/downloadService';
import { Download } from 'lucide-react';

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    getDownloads().then(({ data }) => setDownloads(data.data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Downloads</h1>
      {downloads.length === 0 ? (
        <p className="text-slate-400">No downloads yet. Generate a ZIP from the preview page.</p>
      ) : (
        <div className="space-y-3">
          {downloads.map((d) => (
            <div key={d._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">{d.extensionId?.name || 'Extension'}</p>
                <p className="text-sm text-slate-400">
                  Downloaded {d.downloadCount} times
                  {d.lastDownloadedAt && ` · Last: ${new Date(d.lastDownloadedAt).toLocaleString()}`}
                </p>
              </div>
              {d.extensionId?.zipUrl && (
                <a href={d.extensionId.zipUrl} className="btn-primary gap-2" download>
                  <Download className="h-4 w-4" /> ZIP
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
