/**
 * Block malicious patterns in generated/user-supplied content before packaging.
 */

const BLOCKED_PATTERNS = [
  { pattern: /eval\s*\(/gi, reason: 'eval() is not allowed' },
  { pattern: /new\s+Function\s*\(/gi, reason: 'Dynamic Function constructor blocked' },
  { pattern: /document\.write\s*\(\s*unescape/gi, reason: 'Obfuscated document.write blocked' },
  { pattern: /crypto\s*\.\s*getRandomValues/gi, reason: 'Suspicious crypto mining pattern' },
  { pattern: /coinhive|cryptonight|minero/gi, reason: 'Crypto miner reference blocked' },
  { pattern: /fetch\s*\(\s*['"][^'"]*password/gi, reason: 'Potential credential exfiltration' },
  { pattern: /localStorage\.getItem\s*\([^)]*\)\s*.*fetch/gi, reason: 'Potential data theft pattern' },
  { pattern: /<script[^>]+src=["']https?:\/\/(?!chrome-extension)/gi, reason: 'External script injection blocked' },
  { pattern: /navigator\.sendBeacon/gi, reason: 'Unauthorized tracking (sendBeacon) restricted', severity: 'warning' },
  { pattern: /chrome\.cookies/gi, reason: 'Cookie access requires explicit review', severity: 'warning' },
];

export function scanFilesForThreats(files) {
  const violations = [];
  const warnings = [];

  for (const [filePath, content] of Object.entries(files)) {
    if (Buffer.isBuffer(content)) continue;
    const text = String(content);

    for (const rule of BLOCKED_PATTERNS) {
      if (rule.pattern.test(text)) {
        const entry = { file: filePath, reason: rule.reason };
        if (rule.severity === 'warning') {
          warnings.push(entry);
        } else {
          violations.push(entry);
        }
        rule.pattern.lastIndex = 0;
      }
    }
  }

  return {
    safe: violations.length === 0,
    violations,
    warnings,
  };
}

export function sanitizeSettings(settings = {}) {
  const clean = {};
  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === 'string') {
      clean[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .slice(0, 10000);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (Array.isArray(value)) {
      clean[key] = value.slice(0, 100);
    }
  }
  return clean;
}
