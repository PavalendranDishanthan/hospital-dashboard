import React, { memo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useDeviceStore } from '../store/useDeviceStore';
import CircularGauge from './CircularGauge';

const PatientCard = memo(({ deviceId }: { deviceId: string }) => {
  const device = useDeviceStore(state => state.devices[deviceId]);
  const { width } = useWindowDimensions();
  
  if (!device) return null;

  const percentage = Math.max(0, (device.current_weight_g / device.total_volume_ml) * 100);
  
  // Calculate color
  let statusColor = '#0d9488'; // Teal
  if (percentage <= 10) statusColor = '#ef4444'; // Red
  else if (percentage <= 24) statusColor = '#f59e0b'; // Amber

  // Mock Time to Empty (TTE) 
  // Assuming rapid drop of ~15g per 3 seconds = 300g per minute (accelerated simulation)
  const minutesRemaining = Math.floor(device.current_weight_g / 300);
  const hours = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;

  let cardWidth: any = '100%';
  if (width >= 1200) cardWidth = '23%';
  else if (width >= 800) cardWidth = '30%';
  else if (width >= 600) cardWidth = '45%';

  return (
    <View style={[styles.card, { width: cardWidth, borderColor: statusColor, borderWidth: percentage <= 10 ? 2 : 1 }]}>
      <View style={styles.header}>
        <Text style={styles.patientName}>{device.patient_name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Rm {device.room_number} - {device.bed_number}</Text>
        </View>
      </View>
      
      <Text style={styles.medicine}>{device.medicine_name}</Text>

      <View style={styles.displayArea}>
        <CircularGauge percentage={percentage} color={statusColor} />
        <View style={styles.digitalDisplay}>
          <Text style={[styles.weightValue, { color: statusColor }]}>{Math.floor(device.current_weight_g)}g</Text>
          <Text style={styles.percentValue}>{percentage.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.tteText}>
          TTE: {hours}h {mins}m
        </Text>
        <Text style={[styles.statusText, { color: statusColor }]}>{device.device_status}</Text>
      </View>
    </View>
  );
});

export default PatientCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  patientName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  medicine: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 20,
  },
  displayArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  digitalDisplay: {
    alignItems: 'flex-end',
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  percentValue: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  tteText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});
