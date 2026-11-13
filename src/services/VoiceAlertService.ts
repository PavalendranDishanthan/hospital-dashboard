// Using a Set for the Throttle Lock
const alertedDevices = new Set<string>();

export const speakAlert = (message: string, deviceId: string) => {
  if (alertedDevices.has(deviceId)) {
    return; // Throttle lock engaged, alert was already played
  }

  alertedDevices.add(deviceId);

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    // Mobile polyfill or react-native-tts would go here
    console.log("VOICE ALERT (Mobile Triggered): ", message);
  }
};

export const acknowledgeAlert = (deviceId: string) => {
  alertedDevices.delete(deviceId);
};
