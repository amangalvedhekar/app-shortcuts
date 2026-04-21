# app-shortcuts

`app-shortcuts` is an Expo module for managing native app launcher shortcuts from React Native.

It lets an app:

- Register dynamic shortcuts shown from the app icon launcher menu.
- Clear registered dynamic shortcuts.
- Read the shortcut that launched the app.
- Listen for shortcut launches while the app is running.
- Render a small native shortcut preview view with `AppShortcutsView`.

## Platform support

- iOS: uses `UIApplicationShortcutItem` dynamic home screen quick actions.
- Android: uses `ShortcutManager` dynamic shortcuts on Android 7.1/API 25 and newer.
- Web: exposes no-op shortcut management methods and a web implementation of `AppShortcutsView`.

## Installation

```sh
npm install app-shortcuts
```

This package is an Expo native module, so use it from an Expo app or a React Native app configured for Expo modules.

## Usage

```tsx
import AppShortcuts, { ShortcutItem } from 'app-shortcuts';
import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';

const shortcuts: ShortcutItem[] = [
  {
    id: 'compose',
    title: 'Compose',
    subtitle: 'Start a new draft',
    icon: 'square.and.pencil',
    url: 'myapp://compose',
    params: { source: 'shortcut' },
  },
  {
    id: 'inbox',
    title: 'Inbox',
    subtitle: 'Jump to your inbox',
    icon: 'tray.full',
    url: 'myapp://inbox',
  },
];

export default function App() {
  const [latestShortcut, setLatestShortcut] = useState<ShortcutItem | null>(null);

  useEffect(() => {
    AppShortcuts.getInitialShortcut().then(setLatestShortcut);

    const subscription = AppShortcuts.addListener('onShortcut', (shortcut) => {
      setLatestShortcut(shortcut);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View>
      <Button title="Set shortcuts" onPress={() => AppShortcuts.setShortcuts(shortcuts)} />
      <Button title="Clear shortcuts" onPress={() => AppShortcuts.clearShortcuts()} />

      <Text>
        {latestShortcut
          ? `Opened shortcut: ${latestShortcut.id}`
          : 'No shortcut opened yet'}
      </Text>
    </View>
  );
}
```

## Shortcut items

Each shortcut is described with a `ShortcutItem`:

```ts
type ShortcutItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  url?: string;
  params?: Record<string, string>;
};
```

- `id`: stable shortcut identifier.
- `title`: primary label shown by the launcher.
- `subtitle`: optional secondary label.
- `icon`: platform-specific icon name.
- `url`: optional deep link or route value your app can interpret.
- `params`: optional string key/value metadata returned when the shortcut is opened.

On iOS, `icon` is resolved as an SF Symbol name. On Android, `icon` is resolved from the app's `drawable` or `mipmap` resources.

## API

### `setShortcuts(items)`

Registers the provided shortcuts as dynamic app shortcuts.

```ts
await AppShortcuts.setShortcuts(shortcuts);
```

On Android, the module respects the platform maximum shortcut count for the current launcher.

### `clearShortcuts()`

Removes all dynamic shortcuts registered by the app.

```ts
await AppShortcuts.clearShortcuts();
```

### `getInitialShortcut()`

Returns the shortcut that launched the current app session, or `null`.

```ts
const shortcut = await AppShortcuts.getInitialShortcut();
```

### `addListener('onShortcut', listener)`

Subscribes to shortcut launch events while the app is active.

```ts
const subscription = AppShortcuts.addListener('onShortcut', (shortcut) => {
  console.log(shortcut);
});

subscription.remove();
```

## Shortcut preview view

The package also exports `AppShortcutsView`, a native view that can render a shortcut-style preview.

```tsx
import { AppShortcutsView } from 'app-shortcuts';

<AppShortcutsView
  title="Compose"
  subtitle="Start a new draft"
  icon="square.and.pencil"
  accentColor="#1d4ed8"
  style={{ height: 160 }}
/>;
```

## Development

```sh
npm install
npm run build
npm run test
```

The example app in `example/` demonstrates setting shortcuts, clearing them, receiving launch events, and rendering `AppShortcutsView`.
