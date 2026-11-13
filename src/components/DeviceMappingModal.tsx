import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useDeviceStore, DeviceData } from '../store/useDeviceStore';

export default function DeviceMappingModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const addDevice = useDeviceStore(state => state.addDevice);
  
  const [deviceId, setDeviceId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [room, setRoom] = useState('');
  const [bed, setBed] = useState('');
  const [medicine, setMedicine] = useState('');
  const [volume, setVolume] = useState('');

  const handleAdd = async () => {
    if (!deviceId || !patientName || !volume) return;
    
    const newDevice: DeviceData = {
      device_id: deviceId,
      patient_name: patientName,
      room_number: room,
      bed_number: bed,
      medicine_name: medicine,
      total_volume_ml: Number(volume),
      current_weight_g: Number(volume),
      device_status: 'NORMAL'
    };
    
    try {
      await addDevice(newDevice);
      
      // Reset form
      setDeviceId('');
      setPatientName('');
      setRoom('');
      setBed('');
      setMedicine('');
      setVolume('');
      onClose();
    } catch (error: any) {
      alert("Failed to save to Firebase: " + error.message);
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Map New Device</Text>
          
          <TextInput style={styles.input} placeholder="Device ID (e.g. ESP32_05)" placeholderTextColor="#64748b" value={deviceId} onChangeText={setDeviceId} />
          <TextInput style={styles.input} placeholder="Patient Name" placeholderTextColor="#64748b" value={patientName} onChangeText={setPatientName} />
          
          <View style={styles.row}>
            <TextInput style={[styles.input, {flex: 1, marginRight: 10}]} placeholder="Room" placeholderTextColor="#64748b" value={room} onChangeText={setRoom} />
            <TextInput style={[styles.input, {flex: 1}]} placeholder="Bed" placeholderTextColor="#64748b" value={bed} onChangeText={setBed} />
          </View>

          <TextInput style={styles.input} placeholder="Medicine (e.g. NaCl 0.9%)" placeholderTextColor="#64748b" value={medicine} onChangeText={setMedicine} />
          <TextInput style={styles.input} placeholder="Total Volume (ml)" placeholderTextColor="#64748b" keyboardType="numeric" value={volume} onChangeText={setVolume} />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.btnText}>Assign Patient</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard: {
    backgroundColor: '#1e293b',
    padding: 30,
    borderRadius: 12,
    width: '90%',
    maxWidth: 500,
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  cancelBtn: {
    padding: 12,
    marginRight: 10
  },
  addBtn: {
    backgroundColor: '#0d9488',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
