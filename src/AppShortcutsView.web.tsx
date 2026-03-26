import * as React from 'react';

import { AppShortcutsViewProps } from './AppShortcuts.types';

export default function AppShortcutsView(props: AppShortcutsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
