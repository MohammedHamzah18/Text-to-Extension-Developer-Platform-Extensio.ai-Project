/**
 * Registry of all extension templates and their configuration schemas.
 * No AI – purely configuration-driven.
 */
export const TEMPLATE_REGISTRY = {
  'image-blocker': {
    id: 'image-blocker',
    name: 'Image Blocker',
    category: 'content-modifier',
    description: 'Hide all images on web pages with a replacement color',
    files: ['manifest.json', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'icons'],
    fields: [
      { key: 'replacementColor', label: 'Replacement Color', type: 'color', default: '#ff0000' },
      { key: 'hideAll', label: 'Hide All Images', type: 'boolean', default: true },
    ],
    permissions: ['storage'],
    hostPermissions: ['<all_urls>'],
    contentScripts: true,
    action: true,
  },
  'dark-mode': {
    id: 'dark-mode',
    name: 'Dark Mode Toggle',
    category: 'utility',
    description: 'Toggle dark mode on any website',
    files: ['manifest.json', 'content.js', 'background.js', 'popup.html', 'popup.js', 'popup.css', 'icons'],
    fields: [
      { key: 'bgColor', label: 'Background Color', type: 'color', default: '#1a1a2e' },
      { key: 'textColor', label: 'Text Color', type: 'color', default: '#eaeaea' },
      { key: 'linkColor', label: 'Link Color', type: 'color', default: '#7eb8ff' },
    ],
    permissions: ['storage', 'activeTab'],
    hostPermissions: ['<all_urls>'],
    contentScripts: true,
    action: true,
    background: true,
  },
  'text-replacer': {
    id: 'text-replacer',
    name: 'Text Replacer',
    category: 'content-modifier',
    description: 'Replace text on pages based on rules',
    files: ['manifest.json', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'options.html', 'options.js', 'icons'],
    fields: [
      { key: 'findText', label: 'Find Text', type: 'text', default: 'Hello' },
      { key: 'replaceText', label: 'Replace With', type: 'text', default: 'Hi' },
      { key: 'caseSensitive', label: 'Case Sensitive', type: 'boolean', default: false },
    ],
    permissions: ['storage'],
    hostPermissions: ['<all_urls>'],
    contentScripts: true,
    action: true,
    options: true,
  },
  'website-blocker': {
    id: 'website-blocker',
    name: 'Website Blocker',
    category: 'productivity',
    description: 'Block distracting websites',
    files: ['manifest.json', 'background.js', 'popup.html', 'popup.js', 'popup.css', 'options.html', 'options.js', 'icons'],
    fields: [
      { key: 'blockedSites', label: 'Blocked Sites (comma-separated)', type: 'textarea', default: 'facebook.com,twitter.com' },
      { key: 'blockMessage', label: 'Block Message', type: 'text', default: 'This site is blocked. Stay focused!' },
    ],
    permissions: ['storage', 'declarativeNetRequest', 'declarativeNetRequestFeedback'],
    hostPermissions: ['<all_urls>'],
    background: true,
    action: true,
    options: true,
  },
  'custom-css': {
    id: 'custom-css',
    name: 'Custom CSS Injector',
    category: 'content-modifier',
    description: 'Inject custom CSS into every page',
    files: ['manifest.json', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'icons'],
    fields: [
      { key: 'customCss', label: 'Custom CSS', type: 'textarea', default: 'body { font-family: sans-serif; }' },
    ],
    permissions: ['storage'],
    hostPermissions: ['<all_urls>'],
    contentScripts: true,
    action: true,
  },
  'bg-color': {
    id: 'bg-color',
    name: 'Background Color Changer',
    category: 'content-modifier',
    description: 'Change page background color',
    files: ['manifest.json', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'icons'],
    fields: [
      { key: 'backgroundColor', label: 'Background Color', type: 'color', default: '#f0f8ff' },
    ],
    permissions: ['storage'],
    hostPermissions: ['<all_urls>'],
    contentScripts: true,
    action: true,
  },
  pomodoro: {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    category: 'productivity',
    description: 'Focus timer in your browser toolbar',
    files: ['manifest.json', 'popup.html', 'popup.js', 'popup.css', 'background.js', 'icons'],
    fields: [
      { key: 'workMinutes', label: 'Work Duration (min)', type: 'number', default: 25 },
      { key: 'breakMinutes', label: 'Break Duration (min)', type: 'number', default: 5 },
    ],
    permissions: ['storage', 'alarms', 'notifications'],
    hostPermissions: [],
    background: true,
    action: true,
  },
  'note-taking': {
    id: 'note-taking',
    name: 'Quick Notes',
    category: 'productivity',
    description: 'Capture notes from any tab',
    files: ['manifest.json', 'popup.html', 'popup.js', 'popup.css', 'background.js', 'icons'],
    fields: [{ key: 'maxNotes', label: 'Max Notes', type: 'number', default: 50 }],
    permissions: ['storage'],
    hostPermissions: [],
    action: true,
    background: true,
  },
  'tab-counter': {
    id: 'tab-counter',
    name: 'Tab Counter',
    category: 'utility',
    description: 'Show open tab count in toolbar',
    files: ['manifest.json', 'popup.html', 'popup.js', 'popup.css', 'background.js', 'icons'],
    fields: [],
    permissions: ['tabs'],
    hostPermissions: [],
    background: true,
    action: true,
  },
  'qr-generator': {
    id: 'qr-generator',
    name: 'QR Code Generator',
    category: 'utility',
    description: 'Generate QR codes for current page URL',
    files: ['manifest.json', 'popup.html', 'popup.js', 'popup.css', 'icons'],
    fields: [{ key: 'qrSize', label: 'QR Size (px)', type: 'number', default: 200 }],
    permissions: ['activeTab'],
    hostPermissions: [],
    action: true,
  },
  'word-counter': {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'utility',
    description: 'Count words and characters on the current page',
    files: ['manifest.json', 'content.js', 'popup.html', 'popup.js', 'popup.css', 'icons'],
    fields: [],
    permissions: ['activeTab', 'scripting'],
    hostPermissions: ['<all_urls>'],
    contentScripts: false,
    action: true,
  },
};

export function getTemplate(templateId) {
  return TEMPLATE_REGISTRY[templateId] || null;
}

export function listTemplates(category) {
  const all = Object.values(TEMPLATE_REGISTRY);
  if (!category) return all;
  return all.filter((t) => t.category === category);
}
