import { getTemplate } from './templateRegistry.js';

/**
 * Build manifest.json (MV3) from template config and user settings.
 */
export function generateManifest({
  name,
  description,
  templateId,
  version = '1.0.0',
}) {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const manifest = {
    manifest_version: 3,
    name,
    description: description || template.description,
    version,
    icons: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
  };

  if (template.permissions?.length) {
    manifest.permissions = [...new Set(template.permissions)];
  }

  if (template.hostPermissions?.length) {
    manifest.host_permissions = [...new Set(template.hostPermissions)];
  }

  if (template.contentScripts) {
    manifest.content_scripts = [
      {
        matches: ['<all_urls>'],
        js: ['content.js'],
        run_at: 'document_end',
      },
    ];
  }

  if (template.background) {
    manifest.background = { service_worker: 'background.js' };
  }

  if (template.action) {
    manifest.action = {
      default_popup: 'popup.html',
      default_title: name,
      default_icon: {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
      },
    };
  }

  if (template.options) {
    manifest.options_ui = {
      page: 'options.html',
      open_in_tab: true,
    };
  }

  if (templateId === 'website-blocker') {
    manifest.declarative_net_request = {
      rule_resources: [
        {
          id: 'ruleset_1',
          enabled: true,
          path: 'rules.json',
        },
      ],
    };
  }

  return manifest;
}
