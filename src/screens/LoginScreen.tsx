import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password) {
      setError('Enter your Staff ID and password to continue.');
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nurse Central Station</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Staff ID / Username" 
          placeholderTextColor="#64748b"
          value={username}
          onChangeText={setUsername}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.biometricContainer}>
          <Text style={styles.biometricText}>Use FaceID / Fingerprint</Text>
          <Switch 
            value={useBiometrics} 
            onValueChange={setUseBiometrics}
            trackColor={{ false: '#334155', true: '#0d9488' }}
          />
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Authenticate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f172a'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 40,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  biometricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  biometricText: {
    color: '#94a3b8',
  },
  error: {
    color: '#f87171',
    fontSize: 13,
    marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: '#0d9488',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
