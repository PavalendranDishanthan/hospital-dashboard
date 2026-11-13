import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useDeviceStore, DeviceData } from '../store/useDeviceStore';
import PatientCard from '../components/PatientCard';
import DeviceMappingModal from '../components/DeviceMappingModal';
import { speakAlert } from '../services/VoiceAlertService';

export default function DashboardScreen() {
  const { devices, initDevices, updateDeviceWeight } = useDeviceStore();
  const [initialized, setInitialized] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Start listening to Firebase real-time database
    const unsubscribe = useDeviceStore.getState().startListening();
    setInitialized(true);

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const deviceList = Object.values(devices);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Central Telemetry Monitor</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Assign Patient</Text>
        </TouchableOpacity>
      </View>
      
      <DeviceMappingModal visible={isModalVisible} onClose={() => setModalVisible(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {deviceList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No patients assigned yet. Click "+ Assign Patient" to map a device.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {deviceList.map(dev => (
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'flex-start'
  }
});
