import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { StatusEvent, DeviceStatus } from '../utils/wardStats';

interface Props {
  events: StatusEvent[];
  onClear: () => void;
}

const COLORS: Record<DeviceStatus, string> = {
  NORMAL: '#0d9488',
  CAUTION: '#f59e0b',
  CRITICAL: '#ef4444',
};

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/** Collapsible list of recent status changes (newest first). Kept in memory for the session. */
export default function ActivityLog({ events, onClear }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setOpen((o) => !o)} accessibilityRole="button">
          <Text style={styles.title}>
            {open ? '▼' : '▶'} Activity log ({events.length})
          </Text>
        </TouchableOpacity>
        {open && events.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {open &&
        (events.length === 0 ? (
          <Text style={styles.empty}>No status changes yet this session.</Text>
        ) : (
          events.map((e) => (
            <View key={e.id} style={styles.row}>
              <Text style={styles.time}>{formatTime(e.time)}</Text>
              <Text style={styles.text}>
                {e.patient_name}:{' '}
                <Text style={{ color: COLORS[e.from] }}>{e.from}</Text> →{' '}
                <Text style={{ color: COLORS[e.to], fontWeight: 'bold' }}>{e.to}</Text>
              </Text>
            </View>
          ))
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#e2e8f0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  clear: {
    color: '#94a3b8',
    fontSize: 12,
  },
  empty: {
    color: '#64748b',
    marginTop: 10,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  time: {
    color: '#64748b',
    fontSize: 12,
    width: 80,
  },
  text: {
    color: '#cbd5e1',
    fontSize: 13,
    flex: 1,
  },
});
