import { requireNativeView } from 'expo';
import * as React from 'react';

import type { AppShortcutsViewProps } from './AppShortcuts.types';

const NativeView: React.ComponentType<AppShortcutsViewProps> =
  requireNativeView('AppShortcuts');

export default function AppShortcutsView(props: AppShortcutsViewProps) {
  return <NativeView {...props} />;
}
