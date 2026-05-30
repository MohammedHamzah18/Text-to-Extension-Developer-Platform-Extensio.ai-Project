import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ValidationReport({ report }) {
  if (!report) return null;

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        {report.valid ? (
          <CheckCircle className="h-5 w-5 text-emerald-400" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400" />
        )}
        <h3 className="font-semibold">
          Validation {report.valid ? 'Passed' : 'Failed'}
        </h3>
      </div>
      {report.errors?.length > 0 && (
        <ul className="space-y-1 text-sm text-red-300">
          {report.errors.map((e, i) => (
            <li key={i}>• {e}</li>
          ))}
        </ul>
      )}
      {report.warnings?.length > 0 && (
        <ul className="space-y-1 text-sm text-amber-300">
          {report.warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-1">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {w}
            </li>
          ))}
        </ul>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {report.checks?.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg px-3 py-2 text-xs ${
              c.passed ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
            }`}
          >
            {c.message}
          </div>
        ))}
      </div>
    </div>
  );
}
