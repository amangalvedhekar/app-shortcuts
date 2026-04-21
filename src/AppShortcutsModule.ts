import { NativeModule, requireNativeModule } from "expo";

import {
  AppShortcutsModuleEvents,
  ShortcutItem,
  Subscription,
} from "./AppShortcuts.types";

declare class AppShortcutsModule extends NativeModule<AppShortcutsModuleEvents> {
  setShortcuts(items: ShortcutItem[]): Promise<void>;
  clearShortcuts(): Promise<void>;
  getInitialShortcut(): Promise<ShortcutItem | null>;
  addListener(
    eventName: "onShortcut",
    listener: (item: ShortcutItem) => void,
  ): Subscription;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AppShortcutsModule>("AppShortcuts");
