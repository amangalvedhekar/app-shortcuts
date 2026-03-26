// Reexport the native module. On web, it will be resolved to AppShortcutsModule.web.ts
// and on native platforms to AppShortcutsModule.ts
export { default } from './AppShortcutsModule';
export { default as AppShortcutsView } from './AppShortcutsView';
export * from  './AppShortcuts.types';
