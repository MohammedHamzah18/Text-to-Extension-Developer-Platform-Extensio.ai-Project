const REQUIRED_MANIFEST_FIELDS = ['manifest_version', 'name', 'version'];
const ALLOWED_MANIFEST_VERSIONS = [3];
const DANGEROUS_PERMISSIONS = ['debugger', 'proxy', 'nativeMessaging'];

/**
 * Validate generated extension files before ZIP packaging.
 */
export function validateExtension(files) {
  const errors = [];
  const warnings = [];
  const checks = [];

  if (!files['manifest.json']) {
    errors.push('Missing manifest.json');
    return buildReport(errors, warnings, checks);
  }

  let manifest;
  try {
    manifest = JSON.parse(files['manifest.json']);
    checks.push({ id: 'json-manifest', passed: true, message: 'manifest.json is valid JSON' });
  } catch (e) {
    errors.push(`Invalid manifest JSON: ${e.message}`);
    checks.push({ id: 'json-manifest', passed: false, message: 'manifest.json parse failed' });
    return buildReport(errors, warnings, checks);
  }

  for (const field of REQUIRED_MANIFEST_FIELDS) {
    if (manifest[field] === undefined) {
      errors.push(`Missing required manifest field: ${field}`);
    }
  }

  if (!ALLOWED_MANIFEST_VERSIONS.includes(manifest.manifest_version)) {
    errors.push(`manifest_version must be ${ALLOWED_MANIFEST_VERSIONS.join(' or ')}`);
  } else {
    checks.push({ id: 'mv3', passed: true, message: 'Manifest V3 compliant' });
  }

  if (manifest.permissions) {
    for (const p of manifest.permissions) {
      if (DANGEROUS_PERMISSIONS.includes(p)) {
        warnings.push(`Potentially sensitive permission: ${p}`);
      }
    }
  }

  if (manifest.content_scripts) {
    for (const cs of manifest.content_scripts) {
      for (const js of cs.js || []) {
        if (!files[js]) errors.push(`Content script referenced but missing: ${js}`);
      }
    }
  }

  if (manifest.background?.service_worker && !files[manifest.background.service_worker]) {
    errors.push(`Missing background script: ${manifest.background.service_worker}`);
  }

  if (manifest.action?.default_popup && !files[manifest.action.default_popup]) {
    errors.push(`Missing popup: ${manifest.action.default_popup}`);
  }

  const iconPaths = manifest.icons ? Object.values(manifest.icons) : [];
  for (const icon of iconPaths) {
    if (!files[icon] && !files[`icons/${icon.split('/').pop()}`]) {
      warnings.push(`Icon may be missing: ${icon}`);
    }
  }

  checks.push({
    id: 'file-count',
    passed: true,
    message: `Generated ${Object.keys(files).length} files`,
  });

  return buildReport(errors, warnings, checks);
}

function buildReport(errors, warnings, checks) {
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    checks,
    timestamp: new Date().toISOString(),
  };
}
