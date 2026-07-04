import { StyleSheet, Text, View } from 'react-native';

import type { CategoryTotal } from '../storage/expenses';
import { formatAmount } from '../storage/expenses';
import { monoFont, textFont, theme } from '../theme';

type ExpensePieChartProps = {
  totals: CategoryTotal[];
};

type PieSegment = CategoryTotal & {
  color: string;
  percent: number;
};

const segmentColors = [
  theme.pink,
  theme.purple,
  theme.cyan,
  theme.yellow,
  theme.green,
  theme.border
];

function buildPieSegments(totals: CategoryTotal[]): PieSegment[] {
  const totalExpense = totals.reduce((sum, item) => sum + item.amount, 0);

  if (totalExpense <= 0) {
    return [];
  }

  return totals.map((item, index) => ({
    ...item,
    color: segmentColors[index % segmentColors.length],
    percent: (item.amount / totalExpense) * 100
  }));
}

function buildConicGradient(segments: PieSegment[]) {
  let cursor = 0;

  const stops = segments.map((segment) => {
    const start = cursor;

    cursor += segment.percent;

    return `${segment.color} ${start}% ${cursor}%`;
  });

  return `conic-gradient(from 0deg, ${stops.join(', ')})`;
}

function formatPercent(percent: number) {
  return `${percent.toFixed(1)}%`;
}

export function ExpensePieChart({ totals }: ExpensePieChartProps) {
  const segments = buildPieSegments(totals);

  if (segments.length === 0) {
    return null;
  }

  const pieStyle = {
    backgroundImage: buildConicGradient(segments)
  } as View['props']['style'];

  return (
    <View style={styles.container}>
      <View accessibilityLabel="支出分類圓餅圖" style={[styles.pie, pieStyle]} />
      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.category} style={styles.legendRow}>
            <View style={styles.legendLabel}>
              <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
              <Text style={styles.legendCategory}>{segment.category}</Text>
            </View>
            <Text style={styles.legendMeta}>
              {formatAmount(segment.amount)} · {formatPercent(segment.percent)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 18
  },
  pie: {
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 200,
    width: 200
  },
  legend: {
    gap: 10,
    width: '100%'
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  legendLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  legendDot: {
    borderRadius: 999,
    height: 10,
    width: 10
  },
  legendCategory: {
    color: theme.text,
    fontFamily: textFont,
    fontSize: 14,
    fontWeight: '600'
  },
  legendMeta: {
    color: theme.cyan,
    fontFamily: monoFont,
    fontSize: 12
  }
});
