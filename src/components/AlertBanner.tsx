import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { DeviceData } from '../store/useDeviceStore';

interface Props {
  criticalDevices: DeviceData[];
  muted: boolean;
  onToggleMute: () => void;
}

/** Red banner shown while any IV bag is critically low, with a voice-alert mute toggle. */
export default function AlertBanner({ criticalDevices, muted, onToggleMute }: Props) {
  if (criticalDevices.length === 0) return null;

  const names = criticalDevices
    .map((d) => `${d.patient_name} (Rm ${d.room_number || '?'}-${d.bed_number || '?'})`)
    .join(', ');

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <View style={styles.textWrap}>
        <Text style={styles.title}>
          {criticalDevices.length} critical IV bag{criticalDevices.length > 1 ? 's' : ''} need attention
        </Text>
        <Text style={styles.names} numberOfLines={2}>
          {names}
        </Text>
      </View>
      <TouchableOpacity style={styles.muteBtn} onPress={onToggleMute}>
        <Text style={styles.muteText}>{muted ? 'Unmute voice alerts' : 'Mute voice alerts'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#450a0a',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: '#fecaca',
    fontWeight: 'bold',
    fontSize: 15,
  },
  names: {
    color: '#fca5a5',
    fontSize: 13,
    marginTop: 2,
  },
  muteBtn: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  muteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
