# Hospital Dashboard – IV Fluid Monitor

A nurse-station dashboard that monitors IV fluid bags in real time. ESP32 weight sensors write readings to Firebase Realtime Database; the app shows every patient's remaining fluid, status and estimated time to empty.

Built with Expo (React Native + Expo Router), TypeScript, Zustand and Firebase.

## Features

- Live patient cards with circular gauge, weight, percentage and status (NORMAL / CAUTION / CRITICAL)
- Assign a device to a patient (room, bed, medicine, volume)
- **Alert Center**
  - Ward summary tiles (Total / Normal / Caution / Critical) that double as status filters
  - Search by patient, room, bed, medicine or device ID
  - Most urgent patients always sorted first
  - Critical alert banner with a mute toggle
  - Voice alert when a bag becomes critical (re-arms after the bag is replaced)
- **Bag replaced** button: resets a patient's bag to full volume
- **Discharge** button (two-tap confirm): unassigns the device
- **Activity log**: timestamped status changes for the current session
- Login form validation and **Log out**

> Note: the login screen is a UI placeholder (no real authentication backend yet).

## Getting started

```bash
npm install
npx expo start --web     # or: npx expo start  (then press a / i)
```

Firebase settings live in `src/services/firebaseConfig.ts`. Make sure your Realtime Database security rules are not open to the public before deploying.

## Project structure

```
src/
  components/   PatientCard, WardSummaryBar, AlertBanner, ActivityLog, DeviceMappingModal, CircularGauge
  screens/      LoginScreen, DashboardScreen
  services/     firebaseConfig, VoiceAlertService
  store/        useDeviceStore (Zustand + Firebase)
  utils/        wardStats (summary, filter/sort, status-change detection)
```

## Team

- _Add each team member's name and what they built here._
