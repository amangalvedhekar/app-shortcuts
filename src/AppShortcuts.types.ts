import type { StyleProp, ViewStyle } from 'react-native';

export type ShortcutItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  url?: string;
  params?: Record<string, string>;
};

export type Subscription = {
  remove(): void;
};

export type AppShortcutsModuleEvents = {
  onShortcut: (item: ShortcutItem) => void;
};

export type AppShortcutsViewProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
};
