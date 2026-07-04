import { Host } from '@expo/ui/jetpack-compose';
import { requireNativeView } from 'expo';
import * as React from 'react';

import type { AppShortcutsViewProps } from './AppShortcuts.types';

const NativeView: React.ComponentType<Omit<AppShortcutsViewProps, 'style'>> =
  requireNativeView('AppShortcuts');

export default function AppShortcutsView(props: AppShortcutsViewProps) {
  const { style, ...nativeProps } = props;

  return (
    <Host style={style}>
      <NativeView {...nativeProps} />
    </Host>
  );
}
