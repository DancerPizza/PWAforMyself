import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { toolEntries } from '../data/tools';
import { monoFont, textFont, theme } from '../theme';
import type { ToolId } from '../types/tool';

type HomeScreenProps = {
  onOpenTool: (toolId: ToolId) => void;
};

export function HomeScreen({ onOpenTool }: HomeScreenProps) {
  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.introSection}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Offline PWA Toolkit</Text>
            <Text style={styles.title}>個人極簡工具集</Text>
            <Text style={styles.description}>
              三項 MVP 功能皆可使用，資料存於本地端。
            </Text>
          </View>
        </View>

        <View style={styles.cardList}>
          {toolEntries.map((tool) => {
            const isReady = tool.status === 'ready';

            return (
              <Pressable
                key={tool.id}
                accessibilityRole="button"
                disabled={!isReady}
                onPress={() => onOpenTool(tool.id)}
                style={({ pressed }) => [
                  styles.card,
                  !isReady && styles.cardDisabled,
                  pressed && isReady && styles.cardPressed
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {tool.title}
                  </Text>
                  <Text style={[styles.statusLabel, isReady && styles.statusLabelReady]}>
                    {tool.statusLabel}
                  </Text>
                </View>
                <Text numberOfLines={2} style={styles.cardSubtitle}>
                  {tool.subtitle}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  introSection: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
    width: '100%'
  },
  header: {
    borderColor: theme.border,
    borderRadius: 24,
    borderWidth: 1,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
    backgroundColor: theme.surface,
    justifyContent: 'center',
    padding: 20,
    width: '100%'
  },
  eyebrow: {
    color: theme.green,
    fontFamily: monoFont,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  title: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
    marginBottom: 8
  },
  description: {
    color: theme.mutedText,
    fontFamily: textFont,
    fontSize: 15,
    lineHeight: 22
  },
  cardList: {
    flex: 2,
    gap: 10,
    minHeight: 0,
    width: '100%'
  },
  card: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    flex: 1,
    justifyContent: 'center',
    minHeight: 0,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%'
  },
  cardDisabled: {
    opacity: 0.55
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }]
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%'
  },
  cardTitle: {
    color: theme.yellow,
    flex: 1,
    flexShrink: 1,
    fontFamily: textFont,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 0
  },
  statusLabel: {
    backgroundColor: theme.background,
    borderRadius: 999,
    borderColor: theme.pink,
    borderWidth: 1,
    color: theme.pink,
    flexShrink: 0,
    fontFamily: monoFont,
    fontSize: 11,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  statusLabelReady: {
    borderColor: theme.green,
    color: theme.green
  },
  cardSubtitle: {
    color: theme.cyan,
    fontFamily: textFont,
    fontSize: 14,
    lineHeight: 20
  }
});
