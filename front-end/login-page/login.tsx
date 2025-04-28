import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  AccountCreator: undefined;
  // Add the home screen here (dashboard)
  Dashboard: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to the same endpoint used in Authenticator.java
      const response = await fetch('http://ec2-54-226-212-222.compute-1.amazonaws.com:3000/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

  if (response.ok) {
    if (data.userId) {
      Alert.alert('Success', 'You have successfully logged in!');
      // Navigate to next screen after successful login
      // Daulet, Please add the home screen here.
      // Example: navigation.navigate('Dashboard');
      // we need to give premission for it to write ...
        const path = RNFS.DocumentDirectoryPath + '/UserId.txt';
          RNFS.appendFile(path, `User ID: ${data.userId}`, 'utf8')



    } else {
      Alert.alert('Login Failed', data.message || 'Invalid username or password');
    }
  } else {
    Alert.alert('Error', data.message || 'Login failed. Please try again.');
  }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Connection Error', 'Could not connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('AccountCreator');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready for those Gains!💪</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleCreateAccount}>
        <Text style={styles.secondaryButtonText}>Create a New Account</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 35,
    color: '#333',
  },
  inputBox: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#A5C2F7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: 'bold',
  },
});