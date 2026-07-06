import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackupActions } from '../components/BackupActions';
import { Screen } from '../components/Screen';
import { toolEntries } from '../data/tools';
import { textFont, theme } from '../theme';
import type { ToolId } from '../types/tool';

// 功能卡 25% ×3、間隔 10% 均分 3 段、匯入匯出列 15%（flex 75 : 10 : 45）
const CARD_FLEX = 75;
const GAP_FLEX = 10;
const BACKUP_FLEX = 45;

type HomeScreenProps = {
  onOpenTool: (toolId: ToolId) => void;
  onDataImported?: () => void;
};

export function HomeScreen({ onOpenTool, onDataImported }: HomeScreenProps) {
  return (
    <Screen>
      <View style={styles.page}>
        {toolEntries.flatMap((tool, index) => {
          const isReady = tool.status === 'ready';
          const nodes = [
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
              <Text numberOfLines={2} style={styles.cardTitle}>
                {tool.title}
              </Text>
            </Pressable>
          ];

          if (index < toolEntries.length - 1) {
            nodes.push(<View key={`${tool.id}-gap`} style={styles.sectionGap} />);
          }

          return nodes;
        })}

        <View style={styles.sectionGap} />
        <View style={styles.backupSlot}>
          <BackupActions onImported={onDataImported} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%'
  },
  card: {
    backgroundColor: theme.surfaceElevated,
    borderColor: theme.border,
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.2)',
    flex: CARD_FLEX,
    justifyContent: 'center',
    minHeight: 0,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%'
  },
  sectionGap: {
    flex: GAP_FLEX,
    minHeight: 0,
    width: '100%'
  },
  backupSlot: {
    flex: BACKUP_FLEX,
    justifyContent: 'center',
    minHeight: 0,
    width: '100%'
  },
  cardDisabled: {
    opacity: 0.55
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }]
  },
  cardTitle: {
    color: theme.yellow,
    fontFamily: textFont,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%'
  }
});
