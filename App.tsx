import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { ExpenseScreen } from './src/screens/ExpenseScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { NoteScreen } from './src/screens/NoteScreen';
import { TodoScreen } from './src/screens/TodoScreen';
import type { ToolId } from './src/types/tool';

type AppRoute = 'home' | ToolId;

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [storageVersion, setStorageVersion] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.scrollTo(0, 0);
    }
  }, [route]);

  if (route === 'todos') {
    return <TodoScreen key={storageVersion} onBack={() => setRoute('home')} />;
  }

  if (route === 'notes') {
    return <NoteScreen key={storageVersion} onBack={() => setRoute('home')} />;
  }

  if (route === 'expenses') {
    return <ExpenseScreen key={storageVersion} onBack={() => setRoute('home')} />;
  }

  return (
    <HomeScreen
      onDataImported={() => setStorageVersion((version) => version + 1)}
      onOpenTool={(toolId) => setRoute(toolId)}
    />
  );
}
