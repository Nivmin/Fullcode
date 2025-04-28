import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';

const API_BASE = "http://ec2-54-226-212-222.compute-1.amazonaws.com:3000";

const App = () => {
  const [leaderboard, setLeaderboard] = useState<{ name: string; points: number }[]>([]); // Updated state type to include name
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [lastTrack, setLastTrack] = useState<string | null>(null);

  const userId = '5'; // Static userId, but could be dynamic based on logged-in user

  const today = new Date().toISOString().split('T')[0];

  // Send login or track action to the API
  const sendAction = async (action: 'login' | 'track') => {
    try {
      const res = await fetch(`${API_BASE}/api/update-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }), // Removed name
      });

      const data = await res.json();
      console.log(data);

      if (data.pointAdded) {
        Alert.alert("🎉 Point Added", `You got 1 point for ${action}!`); // Fixed the alert string quote
      } else {
        Alert.alert("⚠️ Already Done", `You've already done ${action} today.`);
      }

      if (data.lastLogin) setLastLogin(data.lastLogin);
      if (data.lastTrack) setLastTrack(data.lastTrack);

      fetchLeaderboard();  // Refresh leaderboard after action
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch leaderboard data from API
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard`);
      const data = await res.json();
      setLeaderboard(data);  // Assumes the API returns an array with name and points
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();  // Fetch leaderboard data on component mount
  }, []);

  // Check if the user has completed login and track actions today
  const doneLoginToday = lastLogin === today;
  const doneTrackToday = lastTrack === today;
  const allDone = doneLoginToday && doneTrackToday;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🏆 Leaderboard</Text>

      <FlatList
        data={leaderboard}
        keyExtractor={(item, index) => index.toString()}  // Use index as the unique key
        renderItem={({ item, index }) => (
          <Text style={{ marginVertical: 5 }}>
            {index + 1}. {item.name} - {item.points} pts  {/* Display name and points */}
          </Text>
        )}
      />

      {!doneLoginToday && (
        <Button title="Login (Add 1 pt)" onPress={() => sendAction('login')} />
      )}

      {!doneTrackToday && (
        <Button title="Track Food (Add 1 pt)" onPress={() => sendAction('track')} />
      )}

      {allDone && (
        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>
          ✅ You've earned all your points today!
        </Text>
      )}
    </View>
  );
};

export default App;