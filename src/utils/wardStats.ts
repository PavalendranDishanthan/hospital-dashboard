import type { DeviceData } from '../store/useDeviceStore';

export type StatusFilter = 'ALL' | DeviceData['device_status'];

export interface WardSummary {
  total: number;
  normal: number;
  caution: number;
  critical: number;
}

const SEVERITY: Record<DeviceData['device_status'], number> = {
  CRITICAL: 0,
  CAUTION: 1,
  NORMAL: 2,
};

/** Count devices by status for the ward summary bar. */
export function summarizeWard(devices: DeviceData[]): WardSummary {
  const summary: WardSummary = { total: devices.length, normal: 0, caution: 0, critical: 0 };
  for (const d of devices) {
    if (d.device_status === 'CRITICAL') summary.critical++;
    else if (d.device_status === 'CAUTION') summary.caution++;
    else summary.normal++;
  }
  return summary;
}

/**
 * Filter by status and free-text search (patient, room, bed, medicine, device id),
 * then sort so the most urgent patients are always shown first.
 */
export function filterAndSortDevices(
  devices: DeviceData[],
  filter: StatusFilter,
  query: string
): DeviceData[] {
  const q = query.trim().toLowerCase();

  return devices
    .filter((d) => filter === 'ALL' || d.device_status === filter)
    .filter((d) => {
      if (!q) return true;
      return [d.patient_name, d.room_number, d.bed_number, d.medicine_name, d.device_id]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const bySeverity = SEVERITY[a.device_status] - SEVERITY[b.device_status];
      if (bySeverity !== 0) return bySeverity;
      // Within the same severity, the bag closest to empty comes first.
      const aPct = a.total_volume_ml ? a.current_weight_g / a.total_volume_ml : 0;
      const bPct = b.total_volume_ml ? b.current_weight_g / b.total_volume_ml : 0;
      return aPct - bPct;
    });
}

/** Spoken message used by the voice alert for a critical device. */
export function buildCriticalMessage(d: DeviceData): string {
  const where = [d.room_number && `room ${d.room_number}`, d.bed_number && `bed ${d.bed_number}`]
    .filter(Boolean)
    .join(', ');
  return `Critical. IV fluid almost empty for ${d.patient_name}${where ? `, ${where}` : ''}.`;
}

export type DeviceStatus = DeviceData['device_status'];

export interface StatusEvent {
  id: string;
  time: number;
  device_id: string;
  patient_name: string;
  from: DeviceStatus;
  to: DeviceStatus;
}

/**
 * Compare the previous status map with the current devices and return one event per
 * device whose status changed. Devices that were not in the previous map (first load,
 * newly assigned) are ignored so the log does not fill up on startup.
 */
export function detectStatusChanges(
  prev: Record<string, DeviceStatus>,
  devices: DeviceData[],
  now: number
): StatusEvent[] {
  const events: StatusEvent[] = [];
  for (const d of devices) {
    const before = prev[d.device_id];
    if (before && before !== d.device_status) {
      events.push({
        id: `${d.device_id}-${now}`,
        time: now,
        device_id: d.device_id,
        patient_name: d.patient_name,
        from: before,
        to: d.device_status,
      });
    }
  }
  return events;
}
