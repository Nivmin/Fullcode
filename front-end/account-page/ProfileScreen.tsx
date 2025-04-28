import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<{ [key: string]: any } | null>(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const UserId = 6; // Example user ID


        const response = await fetch('http://ec2-54-226-212-222.compute-1.amazonaws.com:3000/GetUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: UserId }),
        });

        const data = await response.json();


        if (data.message === "Successful!" && data.user) {
          setUserData(data.user);
        } else if (data.message === "User not Found!") {
          setError("User not found");
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const handleLogin = () => {
      // daulet where code for login goes

    setIsLoggedIn(true);
  };


  const handleRetry = () => {
    setLoading(true);
    setError('');
    setUserData(null);
    useEffect(() => fetchUserData(), []);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loginPrompt}>Please log in to view your profile.</Text>
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No user data available</Text>
        <Button title="Retry" onPress={handleRetry} />
      </View>
    );
  }

  const formatDOB = (dobString: string) => {
    try {
      const dob = new Date(dobString);
      return dob.toLocaleDateString();
    } catch {
      return dobString;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{`${userData.Forename} ${userData.Surname}`}</Text>
        <Text style={styles.userId}>User ID: {userData.UserID}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <InfoRow label="Email" value={userData.Email} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <InfoRow label="Date of Birth" value={formatDOB(userData.DOB)} />
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 120,
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginPrompt: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
});

export default ProfileScreen;
