import { registerWebModule, NativeModule } from 'expo';

import { AppShortcutsModuleEvents, ShortcutItem } from './AppShortcuts.types';

class AppShortcutsModule extends NativeModule<AppShortcutsModuleEvents> {
  private initialShortcut: ShortcutItem | null = null;

  async setShortcuts(_items: ShortcutItem[]): Promise<void> {}

  async clearShortcuts(): Promise<void> {
    this.initialShortcut = null;
  }

  async getInitialShortcut(): Promise<ShortcutItem | null> {
    return this.initialShortcut;
  }
}

export default registerWebModule(AppShortcutsModule, 'AppShortcuts');
