import { registerWebModule, NativeModule } from 'expo';

import { AppShortcutsModuleEvents } from './AppShortcuts.types';

class AppShortcutsModule extends NativeModule<AppShortcutsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(AppShortcutsModule, 'AppShortcutsModule');
