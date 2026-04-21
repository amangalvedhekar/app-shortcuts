import * as React from 'react';

import { AppShortcutsViewProps } from './AppShortcuts.types';

export default function AppShortcutsView(props: AppShortcutsViewProps) {
  const accentColor = props.accentColor ?? '#2f6fed';

  return (
    <div
      style={{
        minHeight: 140,
        borderRadius: 24,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${accentColor}, #111827)`,
        color: '#fff',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
      }}
    >
      <div
        style={{
          alignSelf: 'flex-start',
          padding: '8px 12px',
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.18)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {props.icon ?? 'Shortcut'}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{props.title}</div>
        {props.subtitle ? (
          <div style={{ marginTop: 8, opacity: 0.82, fontSize: 14 }}>{props.subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}
