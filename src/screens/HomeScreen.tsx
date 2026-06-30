import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { toolEntries } from '../data/tools';

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
    backgroundColor: '#f7f3ea'
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32
  },
  header: {
    marginBottom: 28
  },
  eyebrow: {
    color: '#7c5e32',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  title: {
    color: '#1f2933',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 12
  },
  description: {
    color: '#52616b',
    fontSize: 16,
    lineHeight: 24
  },
  cardList: {
    gap: 14
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 22,
    borderWidth: 1,
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.08)',
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
    color: '#1f2933',
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    marginRight: 12
  },
  statusLabel: {
    backgroundColor: '#f0e4d1',
    borderRadius: 999,
    color: '#7c5e32',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  cardSubtitle: {
    color: '#52616b',
    fontSize: 15,
    lineHeight: 22
  }
});
