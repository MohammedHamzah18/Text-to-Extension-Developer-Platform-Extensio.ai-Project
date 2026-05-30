import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function CodePreview({ files = {}, folderStructure }) {
  const paths = Object.keys(files).sort();
  const [active, setActive] = useState(paths[0] || 'manifest.json');

  const languageFor = (path) => {
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.css')) return 'css';
    return 'plaintext';
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <div className="card max-h-[500px] overflow-auto p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Files
        </p>
        <ul className="space-y-0.5 text-sm">
          {paths.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => setActive(p)}
                className={`w-full rounded px-2 py-1 text-left font-mono text-xs ${
                  active === p ? 'bg-brand-600/30 text-brand-300' : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
        {folderStructure && (
          <div className="mt-4 border-t border-slate-700 pt-3">
            <p className="mb-1 text-xs text-slate-500">Structure</p>
            <FolderTree node={folderStructure} />
          </div>
        )}
      </div>
      <div className="card overflow-hidden p-0">
        <Editor
          height="420px"
          language={languageFor(active)}
          value={files[active] || ''}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}

function FolderTree({ node, depth = 0 }) {
  if (!node) return null;
  return (
    <div style={{ paddingLeft: depth * 8 }}>
      <span className="font-mono text-xs text-slate-500">
        {node.type === 'folder' ? '📁' : '📄'} {node.name}
      </span>
      {node.children?.map((c, i) => (
        <FolderTree key={i} node={c} depth={depth + 1} />
      ))}
    </div>
  );
}
