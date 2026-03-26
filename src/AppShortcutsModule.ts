import { NativeModule, requireNativeModule } from 'expo';

import { AppShortcutsModuleEvents } from './AppShortcuts.types';

declare class AppShortcutsModule extends NativeModule<AppShortcutsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AppShortcutsModule>('AppShortcuts');
