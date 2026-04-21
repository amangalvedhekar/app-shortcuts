import AppShortcuts, { AppShortcutsView, ShortcutItem } from 'app-shortcuts';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type RootStackParamList = {
  Home: { shortcut?: ShortcutItem } | undefined;
  Inbox: { shortcut?: ShortcutItem } | undefined;
  Compose: { shortcut?: ShortcutItem } | undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type InboxScreenProps = NativeStackScreenProps<RootStackParamList, 'Inbox'>;
type ComposeScreenProps = NativeStackScreenProps<RootStackParamList, 'Compose'>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

const shortcuts: ShortcutItem[] = [
  {
    id: 'compose',
    title: 'Compose',
    subtitle: 'Start a new draft',
    icon: 'square.and.pencil',
    url: 'appshortcuts://compose',
    params: { source: 'shortcut' },
  },
  {
    id: 'inbox',
    title: 'Inbox',
    subtitle: 'Jump back in',
    icon: 'tray.full',
    url: 'appshortcuts://inbox',
  },
  {
    id: 'home',
    title: 'Home',
    subtitle: 'Open the dashboard',
    icon: 'house',
    url: 'appshortcuts://home',
  },
];

function routeNameForShortcut(shortcut: ShortcutItem): keyof RootStackParamList {
  const route = shortcut.url?.replace('appshortcuts://', '') ?? shortcut.id;

  switch (route) {
    case 'compose':
      return 'Compose';
    case 'inbox':
      return 'Inbox';
    default:
      return 'Home';
  }
}

function navigateToShortcut(shortcut: ShortcutItem) {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.navigate(routeNameForShortcut(shortcut), { shortcut });
  return true;
}

export default function App() {
  const pendingShortcutRef = useRef<ShortcutItem | null>(null);

  useEffect(() => {
    AppShortcuts.getInitialShortcut().then((shortcut) => {
      if (!shortcut) {
        return;
      }

      if (!navigateToShortcut(shortcut)) {
        pendingShortcutRef.current = shortcut;
      }
    });

    const subscription = AppShortcuts.addListener('onShortcut', (shortcut) => {
      if (!navigateToShortcut(shortcut)) {
        pendingShortcutRef.current = shortcut;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        if (pendingShortcutRef.current) {
          navigateToShortcut(pendingShortcutRef.current);
          pendingShortcutRef.current = null;
        }
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'App Shortcuts' }} />
        <Stack.Screen name="Inbox" component={InboxScreen} />
        <Stack.Screen name="Compose" component={ComposeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation, route }: HomeScreenProps) {
  const [latestShortcut, setLatestShortcut] = useState<ShortcutItem | null>(
    route.params?.shortcut ?? null,
  );

  useEffect(() => {
    if (route.params?.shortcut) {
      setLatestShortcut(route.params.shortcut);
    }
  }, [route.params?.shortcut]);

  return (
    <Screen>
      <Text style={styles.header}>Home</Text>
      <Group name="Manage shortcuts">
        <Button
          title="Set shortcuts"
          onPress={async () => {
            await AppShortcuts.setShortcuts(shortcuts);
          }}
        />
        <View style={styles.spacer} />
        <Button title="Clear shortcuts" onPress={() => AppShortcuts.clearShortcuts()} />
      </Group>

      <Group name="Navigate">
        <Button title="Open Inbox" onPress={() => navigation.navigate('Inbox')} />
        <View style={styles.spacer} />
        <Button title="Open Compose" onPress={() => navigation.navigate('Compose')} />
      </Group>

      <Group name="Latest shortcut">
        <Text selectable>{latestShortcut ? JSON.stringify(latestShortcut, null, 2) : 'None'}</Text>
      </Group>

      <Group name="Native preview">
        <AppShortcutsView
          title={latestShortcut?.title ?? shortcuts[0].title}
          subtitle={latestShortcut?.subtitle ?? shortcuts[0].subtitle}
          icon={latestShortcut?.icon ?? shortcuts[0].icon}
          accentColor="#1d4ed8"
          style={styles.preview}
        />
      </Group>
    </Screen>
  );
}

function InboxScreen({ route }: InboxScreenProps) {
  return (
    <Screen>
      <Text style={styles.header}>Inbox</Text>
      <Group name="Opened from">
        <Text selectable>{route.params?.shortcut ? JSON.stringify(route.params.shortcut, null, 2) : 'Manual navigation'}</Text>
      </Group>
      <Group name="Message">
        <Text style={styles.body}>This screen is opened by the Inbox app shortcut.</Text>
      </Group>
    </Screen>
  );
}

function ComposeScreen({ route }: ComposeScreenProps) {
  return (
    <Screen>
      <Text style={styles.header}>Compose</Text>
      <Group name="Opened from">
        <Text selectable>{route.params?.shortcut ? JSON.stringify(route.params.shortcut, null, 2) : 'Manual navigation'}</Text>
      </Group>
      <Group name="Draft">
        <Text style={styles.body}>This screen is opened by the Compose app shortcut.</Text>
      </Group>
    </Screen>
  );
}

function Screen(props: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>{props.children}</ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  header: {
    fontSize: 30,
    marginHorizontal: 20,
    marginTop: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  content: {
    paddingBottom: 20,
  },
  spacer: {
    height: 12,
  },
  preview: {
    height: 160,
  },
});
