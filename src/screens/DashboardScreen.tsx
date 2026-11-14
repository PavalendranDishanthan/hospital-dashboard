import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useDeviceStore, DeviceData } from '../store/useDeviceStore';
import PatientCard from '../components/PatientCard';
import DeviceMappingModal from '../components/DeviceMappingModal';
import WardSummaryBar from '../components/WardSummaryBar';
import AlertBanner from '../components/AlertBanner';
import ActivityLog from '../components/ActivityLog';
import { speakAlert, acknowledgeAlert } from '../services/VoiceAlertService';
import {
  summarizeWard,
  filterAndSortDevices,
  buildCriticalMessage,
  detectStatusChanges,
  StatusFilter,
  StatusEvent,
  DeviceStatus,
} from '../utils/wardStats';

export default function DashboardScreen({ onLogout }: { onLogout?: () => void }) {
  const { devices, initDevices, updateDeviceWeight } = useDeviceStore();
  const [initialized, setInitialized] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [events, setEvents] = useState<StatusEvent[]>([]);
  const prevStatusRef = useRef<Record<string, DeviceStatus>>({});

  useEffect(() => {
    // Start listening to Firebase real-time database
    const unsubscribe = useDeviceStore.getState().startListening();
    setInitialized(true);

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const deviceList = useMemo(() => Object.values(devices), [devices]);
  const summary = useMemo(() => summarizeWard(deviceList), [deviceList]);
  const criticalDevices = useMemo(
    () => deviceList.filter((d) => d.device_status === 'CRITICAL'),
    [deviceList]
  );
  const visibleDevices = useMemo(
    () => filterAndSortDevices(deviceList, statusFilter, searchQuery),
    [deviceList, statusFilter, searchQuery]
  );

  // Activity log: record every status change (e.g. NORMAL -> CAUTION) with a timestamp.
  useEffect(() => {
    const changes = detectStatusChanges(prevStatusRef.current, deviceList, Date.now());
    if (changes.length > 0) {
      setEvents((prev) => [...changes, ...prev].slice(0, 50));
    }
    const next: Record<string, DeviceStatus> = {};
    deviceList.forEach((d) => (next[d.device_id] = d.device_status));
    prevStatusRef.current = next;
  }, [deviceList]);

  // Voice alert: speak once when a bag becomes critical. The throttle lock in
  // VoiceAlertService is released when the bag recovers (e.g. refilled), so a
  // later critical event for the same device alerts again.
  useEffect(() => {
    deviceList.forEach((d) => {
      if (d.device_status === 'CRITICAL') {
        if (!voiceMuted) speakAlert(buildCriticalMessage(d), d.device_id);
      } else {
        acknowledgeAlert(d.device_id);
      }
    });
  }, [deviceList, voiceMuted]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Central Telemetry Monitor</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ Assign Patient</Text>
          </TouchableOpacity>
          {onLogout && (
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.addBtnText}>Log out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <DeviceMappingModal visible={isModalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {deviceList.length > 0 && (
          <>
            <AlertBanner
              criticalDevices={criticalDevices}
              muted={voiceMuted}
              onToggleMute={() => setVoiceMuted((m) => !m)}
            />
            <WardSummaryBar summary={summary} activeFilter={statusFilter} onSelect={setStatusFilter} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patient, room, bed or medicine"
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <ActivityLog events={events} onClear={() => setEvents([])} />
          </>
        )}

        {deviceList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No patients assigned yet. Click "+ Assign Patient" to map a device.</Text>
          </View>
        ) : visibleDevices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No patients match the current filter.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {visibleDevices.map(dev => (
              <PatientCard key={dev.device_id} deviceId={dev.device_id} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  logoutBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: '#0d9488',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'flex-start'
  }
});
