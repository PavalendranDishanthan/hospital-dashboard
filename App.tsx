import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <DashboardScreen onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark Slate Blue
  },
});
