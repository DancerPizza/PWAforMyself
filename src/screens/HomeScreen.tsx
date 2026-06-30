import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { toolEntries } from '../data/tools';

const theme = {
  background: '#23272e',
  surface: '#31332b',
  surfaceElevated: '#383a31',
  border: '#54564b',
  text: '#f8f8f2',
  mutedText: '#cfcfc2',
  pink: '#db6d76',
  green: '#a6e22e',
  yellow: '#e7e197',
  cyan: '#8ce2f3',
  purple: '#ae81ff'
};

const monoFont = 'JetBrains Mono, Noto Sans TC, monospace';
const textFont = 'Noto Sans TC, JetBrains Mono, sans-serif';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Offline PWA Toolkit</Text>
          <Text style={styles.title}>個人極簡工具集</Text>
          <Text style={styles.description}>
            先建立手機優先的三個功能入口，後續再逐步補上本地儲存與 CRUD。
          </Text>
        </View>

        <View style={styles.cardList}>
          {toolEntries.map((tool) => (
            <Pressable
              key={tool.id}
              accessibilityRole="button"
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{tool.title}</Text>
                <Text style={styles.statusLabel}>{tool.statusLabel}</Text>
              </View>
              <Text style={styles.cardSubtitle}>{tool.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32
  },
  header: {
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: `0 16px 36px rgba(0, 0, 0, 0.22)`,
    backgroundColor: theme.surface,
    marginBottom: 28,
    padding: 22
  },
  eyebrow: {
    color: theme.green,
    fontFamily: monoFont,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  title: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 34,
    fontWeight: '600',
    lineHeight: 42,
    marginBottom: 12
  },
  description: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 16,
    lineHeight: 24
  },
  cardList: {
    gap: 14
  },
  card: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 22,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    padding: 20,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }]
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  cardTitle: {
    color: theme.yellow,
    flex: 1,
    fontFamily: textFont,
    fontSize: 20,
    fontWeight: '600',
    marginRight: 12
  },
  statusLabel: {
    backgroundColor: theme.background,
    borderRadius: 999,
    borderColor: theme.pink,
    borderWidth: 1,
    color: theme.pink,
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  cardSubtitle: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 15,
    lineHeight: 22
  }
});
