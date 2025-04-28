import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';

// Example hardcoded user ID (replace with real auth later)
const userid = 6;

const PointsBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
// code to get name
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://ec2-54-226-212-222.compute-1.amazonaws.com:3000/GetUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: userid }),
      });

      const data = await response.json();

      if (data.message !== "Successful!" || !data.user) {
        throw new Error(data.message || 'Failed to fetch user data');
      }

      setUser(data.user);
    } catch (error) {
      console.error('User fetch error:', error);
      Alert.alert('Error', 'Failed to load user data.');
    }
  };
// code that broken
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://ec2-54-226-212-222.compute-1.amazonaws.com:3000/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
      Alert.alert('Error', 'Failed to load leaderboard.');
    }
  };
// someone what broken but not hard to fix
  const claimPoints = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://ec2-54-226-212-222.compute-1.amazonaws.com:3000/update-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserID: userid,
          Points: 10,
        }),
      });
// checks if theyve signed in today
      const result = await response.json();
      setLoading(false);

      if (result.message.includes("already been updated")) {
        Alert.alert('Already Claimed', 'You already got points today.');
      } else {
        Alert.alert('Success', 'Points added!');
        fetchUserData();
        fetchLeaderboard();
      }
    } catch (error) {
      setLoading(false);
      console.error('Claim points error:', error);
      Alert.alert('Error', 'Network error. Try again.');
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchLeaderboard();
  }, []);

  const hasClaimedToday = () => {
    if (!user || !user.Login) return false;
    const lastLogin = new Date(user.Login).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return lastLogin === today;
  };


  const showPerson = ({ item, index }) => (
    <View style={[
      styles.row,
      index === 0 ? styles.gold : (index === 1 ? styles.silver : (index === 2 ? styles.bronze : {}))
    ]}>
      <Text style={styles.num}>#{index + 1}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.points} pts</Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <Text style={styles.header}>Daily Points</Text>

      <View style={styles.box}>
        {!user ? (
          <ActivityIndicator size="small" color="#0066cc" />
        ) : (
          <>
            <Text style={styles.greeting}>
              Welcome, {user.Forename} {user.Surname}!
            </Text>
            <Text style={styles.pointsText}>
              Your points: {user.Points || 0}
            </Text>
            <TouchableOpacity
              style={[styles.btn, hasClaimedToday() && styles.btnDone]}
              onPress={claimPoints}
              disabled={hasClaimedToday() || loading}
            >
              <Text style={styles.btnText}>
                {hasClaimedToday() ? 'Already Claimed Today' : 'Get Daily Login Points'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.subHeader}>Leaderboard</Text>

// everything bellow in diplaying leaderboard


      {leaderboard.length === 0 ? (
        <ActivityIndicator size="large" color="#0066cc" style={styles.spinner} />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item, index) => `rank-${index}`}
          renderItem={showPerson}
          contentContainerStyle={styles.list}
          onRefresh={() => {
            fetchUserData();
            fetchLeaderboard(); // calls the functions to get the data
          }}
          refreshing={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0066cc',
  },
  btn: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnDone: {
    backgroundColor: '#aaa',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 1,
  },
  gold: {
    backgroundColor: '#fef9e7',
    borderColor: '#f1c40f',
    borderWidth: 1,
  },
  silver: {
    backgroundColor: '#f5f5f5',
    borderColor: '#bdc3c7',
    borderWidth: 1,
  },
  bronze: {
    backgroundColor: '#fdf2e9',
    borderColor: '#e67e22',
    borderWidth: 1,
  },
  num: {
    fontWeight: 'bold',
    fontSize: 16,
    width: 40,
    color: '#333',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  score: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0066cc',
  },
  spinner: {
    marginTop: 40,
  },
});

export default PointsBoard;
