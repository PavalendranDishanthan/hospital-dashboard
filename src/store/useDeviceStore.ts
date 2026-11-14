import { create } from 'zustand';
import { db } from '../services/firebaseConfig';
import { ref, onValue, set, update, remove } from 'firebase/database';

export interface DeviceData {
  device_id: string;
  room_number: string;
  bed_number: string;
  patient_name: string;
  medicine_name: string;
  total_volume_ml: number;
  current_weight_g: number;
  device_status: 'NORMAL' | 'CAUTION' | 'CRITICAL';
}

interface DeviceStore {
  devices: Record<string, DeviceData>;
  initDevices: (devices: DeviceData[]) => void;
  addDevice: (device: DeviceData) => Promise<void>;
  updateDeviceWeight: (id: string, weight: number) => Promise<void>;
  refillDevice: (id: string) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
  startListening: () => () => void; // Returns unsubscribe function
}

export const useDeviceStore = create<DeviceStore>((setStore, get) => ({
  devices: {},
  initDevices: (devices) => {
    const deviceMap: Record<string, DeviceData> = {};
    devices.forEach((d) => (deviceMap[d.device_id] = d));
    setStore({ devices: deviceMap });
  },
  
  addDevice: async (device) => {
    // Instead of just local state, we push to Firebase
    const deviceRef = ref(db, `devices/${device.device_id}`);
    await set(deviceRef, device);
    // The onValue listener will automatically update the local state
  },
  
  updateDeviceWeight: async (id, weight) => {
    const device = get().devices[id];
    if (!device) return;

    const percentage = (weight / device.total_volume_ml) * 100;
    let status: 'NORMAL' | 'CAUTION' | 'CRITICAL' = 'NORMAL';
    if (percentage <= 10) status = 'CRITICAL';
    else if (percentage <= 24) status = 'CAUTION';

    // Update Firebase directly
    const deviceRef = ref(db, `devices/${id}`);
    await update(deviceRef, {
      current_weight_g: weight,
      device_status: status
    });
  },

  // Nurse swapped the bag: reset the reading to the full volume (status returns to NORMAL).
  refillDevice: async (id) => {
    const device = get().devices[id];
    if (!device) return;
    await get().updateDeviceWeight(id, device.total_volume_ml);
  },

  // Discharge / unassign: removes the device mapping from Firebase.
  removeDevice: async (id) => {
    await remove(ref(db, `devices/${id}`));
  },

  startListening: () => {
    const devicesRef = ref(db, 'devices');
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStore({ devices: data });
      } else {
        setStore({ devices: {} });
      }
    });

    return unsubscribe;
  }
}));
