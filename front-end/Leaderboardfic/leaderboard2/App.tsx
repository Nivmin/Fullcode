// App.tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import PointsBoard from './PointsBoard'; // Make sure this points to the correct path

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.appContainer}>
        <PointsBoard />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appContainer: {
    flex: 1,
  },
});