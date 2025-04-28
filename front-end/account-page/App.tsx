import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreen from './ProfileScreen';

export default function App() {
  return (
    <View style={styles.appContainer}>
      <ProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});