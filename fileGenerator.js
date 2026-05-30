import { getTemplate } from './templateRegistry.js';
import { generateManifest } from './manifestGenerator.js';
import { loadAndRender, buildVariables } from './templateEngine.js';
import { generatePlaceholderIcons } from '../utils/iconGenerator.js';

const FILE_MAP = {
  'manifest.json': async (ctx) => JSON.stringify(ctx.manifest, null, 2),
  'content.js': (ctx) => loadAndRender(ctx.templateId, 'content.js', ctx.vars),
  'background.js': (ctx) => loadAndRender(ctx.templateId, 'background.js', ctx.vars),
  'popup.html': (ctx) => loadAndRender(ctx.templateId, 'popup.html', ctx.vars),
  'popup.js': (ctx) => loadAndRender(ctx.templateId, 'popup.js', ctx.vars),
  'popup.css': (ctx) => loadAndRender(ctx.templateId, 'popup.css', ctx.vars),
  'options.html': (ctx) => loadAndRender(ctx.templateId, 'options.html', ctx.vars),
  'options.js': (ctx) => loadAndRender(ctx.templateId, 'options.js', ctx.vars),
  'rules.json': (ctx) => loadAndRender(ctx.templateId, 'rules.json', ctx.vars),
};

/**
 * Generate all extension files for a project.
 * Returns { [filePath]: content } including icons as base64 paths handled separately.
 */
export async function generateExtensionFiles({
  name,
  description,
  templateId,
  settings = {},
  version = '1.0.0',
}) {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const manifest = generateManifest({ name, description, templateId, version });
  const vars = buildVariables(name, description, settings, templateId);
  const ctx = { templateId, vars, manifest, settings, name };

  const files = {};
  const needed = template.files.filter((f) => f !== 'icons');

  for (const file of needed) {
    if (file === 'manifest.json') {
      files[file] = await FILE_MAP[file](ctx);
      continue;
    }
    const generator = FILE_MAP[file];
    if (generator) {
      files[file] = await generator(ctx);
    }
  }

  // Icons (generated programmatically – no external assets)
  const icons = await generatePlaceholderIcons(name);
  files['icons/icon16.png'] = icons.icon16;
  files['icons/icon48.png'] = icons.icon48;
  files['icons/icon128.png'] = icons.icon128;

  return files;
}
