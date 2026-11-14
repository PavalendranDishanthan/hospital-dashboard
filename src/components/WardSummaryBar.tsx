import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { WardSummary, StatusFilter } from '../utils/wardStats';

interface Props {
  summary: WardSummary;
  activeFilter: StatusFilter;
  onSelect: (filter: StatusFilter) => void;
}

const TILES: { key: StatusFilter; label: string; value: keyof WardSummary; color: string }[] = [
  { key: 'ALL', label: 'Total', value: 'total', color: '#38bdf8' },
  { key: 'NORMAL', label: 'Normal', value: 'normal', color: '#0d9488' },
  { key: 'CAUTION', label: 'Caution', value: 'caution', color: '#f59e0b' },
  { key: 'CRITICAL', label: 'Critical', value: 'critical', color: '#ef4444' },
];

/** Row of tappable tiles: shows ward counts and doubles as the status filter. */
export default function WardSummaryBar({ summary, activeFilter, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {TILES.map((tile) => {
        const active = activeFilter === tile.key;
        return (
          <TouchableOpacity
            key={tile.key}
            style={[styles.tile, active && { borderColor: tile.color, backgroundColor: '#0f172a' }]}
            onPress={() => onSelect(active && tile.key !== 'ALL' ? 'ALL' : tile.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${tile.label}: ${summary[tile.value]}`}
          >
            <Text style={[styles.count, { color: tile.color }]}>{summary[tile.value]}</Text>
            <Text style={styles.label}>{tile.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    alignItems: 'center',
  },
  count: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
});
