import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_ROOT = path.join(__dirname, '../../templates');

/**
 * Replace {{PLACEHOLDER}} tokens in template strings.
 */
export function renderTemplateString(template, variables) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = variables[key];
    if (val === undefined || val === null) return '';
    return String(val);
  });
}

/**
 * Load a template file and render placeholders.
 */
export async function loadAndRender(templateId, fileName, variables) {
  const filePath = path.join(TEMPLATES_ROOT, templateId, fileName);
  let content;
  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch {
    // Fallback: try .template extension
    content = await fs.readFile(`${filePath}.template`, 'utf-8');
  }
  return renderTemplateString(content, variables);
}

export function buildVariables(extensionName, description, settings, templateId) {
  const base = {
    EXTENSION_NAME: extensionName,
    EXTENSION_DESCRIPTION: description || extensionName,
    EXTENSION_NAME_SHORT: extensionName.slice(0, 12),
    ...flattenSettings(settings),
  };

  // Template-specific computed vars
  if (templateId === 'website-blocker') {
    const sites = (settings.blockedSites || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    base.BLOCKED_SITES_JSON = JSON.stringify(sites);
    base.BLOCKED_SITES_RULES = sites
      .map((site, i) => {
        const domain = site.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        return `    {
      "id": ${i + 1},
      "priority": 1,
      "action": { "type": "block" },
      "condition": {
        "urlFilter": "||${domain}^",
        "resourceTypes": ["main_frame"]
      }
    }`;
      })
      .join(',\n');
  }

  if (templateId === 'image-blocker') {
    base.REPLACEMENT_COLOR = settings.replacementColor || '#ff0000';
    base.HIDE_ALL = settings.hideAll !== false ? 'true' : 'false';
  }

  if (templateId === 'text-replacer') {
    base.FIND_TEXT_ESCAPED = JSON.stringify(settings.findText || '');
    base.REPLACE_TEXT_ESCAPED = JSON.stringify(settings.replaceText || '');
    base.CASE_SENSITIVE_FLAG = settings.caseSensitive ? 'true' : 'false';
  }

  if (templateId === 'custom-css') {
    base.CUSTOM_CSS_ESCAPED = JSON.stringify(settings.customCss || '');
  }

  return base;
}

function flattenSettings(settings = {}) {
  const out = {};
  for (const [k, v] of Object.entries(settings)) {
    const upper = k.replace(/([A-Z])/g, '_$1').toUpperCase();
    const key = upper.startsWith('_') ? upper.slice(1) : upper;
    out[key] = v;
    out[k] = v;
    // CamelCase to SCREAMING_SNAKE for templates
    const snake = k.replace(/([A-Z])/g, '_$1').toUpperCase();
    out[snake] = v;
  }
  return out;
}
