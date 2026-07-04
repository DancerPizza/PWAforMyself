import { useState } from 'react';

import { ExpenseScreen } from './src/screens/ExpenseScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { NoteScreen } from './src/screens/NoteScreen';
import { TodoScreen } from './src/screens/TodoScreen';
import type { ToolId } from './src/types/tool';

type AppRoute = 'home' | ToolId;

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');

  if (route === 'todos') {
    return <TodoScreen onBack={() => setRoute('home')} />;
  }

  if (route === 'notes') {
    return <NoteScreen onBack={() => setRoute('home')} />;
  }

  if (route === 'expenses') {
    return <ExpenseScreen onBack={() => setRoute('home')} />;
  }

  return <HomeScreen onOpenTool={(toolId) => setRoute(toolId)} />;
}
