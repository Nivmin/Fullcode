import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.106:8000'; 

export default function TdeeAndBmrPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);

  const calculateBMR = async () => {
    if (!weight || !height || !age) {
      Alert.alert('Error', 'Please fill in all fields (weight, height, age)');
      return;
    }
    try {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      const a = parseInt(age);

      if (isNaN(w) || isNaN(h) || isNaN(a)) {
        Alert.alert('Error', 'Weight, height, and age must be numbers');
        return;
      }

      const res = await axios.get<{ bmr: number }>(`${API_URL}/calculate_bmr`, {
        params: { weight: w, height: h, age: a, gender: gender },
      });
      setBmr(res.data.bmr);
    } catch (error) {
      console.error('Error calculating BMR:', error);
      Alert.alert('Server Error', 'Failed to calculate BMR.');
    }
  };

  const calculateTDEE = async () => {
    if (bmr === null) {
      Alert.alert('Error', 'Please calculate BMR first.');
      return;
    }
    try {
      const res = await axios.get<{ tdee: number }>(`${API_URL}/calculate_tdee`, {
        params: { bmr: bmr, activity_level: activityLevel },
      });
      setTdee(res.data.tdee);
    } catch (error) {
      console.error('Error calculating TDEE:', error);
      Alert.alert('Server Error', 'Failed to calculate TDEE.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 BMR & TDEE</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Enter Info</Text>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#aaa"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          placeholderTextColor="#aaa"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Age (years)"
          placeholderTextColor="#aaa"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitleSmall}>Select Gender:</Text>
        <View style={styles.optionList}>
          {['male', 'female'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setGender(item as 'male' | 'female')}
              style={[
                styles.optionItem,
                gender === item && styles.optionItemSelected,
              ]}
            >
              <Text style={styles.optionText}>{item.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateBMR}>
          <Text style={styles.buttonText}>Calculate BMR</Text>
        </TouchableOpacity>
      </View>

      {bmr !== null && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your BMR</Text>
          <Text style={styles.resultText}>{bmr.toFixed(2)} kcal/day</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Activity Level</Text>
        <View style={styles.optionList}>
          {[
            { label: 'Sedentary', value: 'sedentary' },
            { label: 'Lightly Active', value: 'lightly_active' },
            { label: 'Moderately Active', value: 'moderately_active' },
            { label: 'Very Active', value: 'very_active' },
            { label: 'Extra Active', value: 'extra_active' },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => setActivityLevel(item.value)}
              style={[
                styles.optionItem,
                activityLevel === item.value && styles.optionItemSelected,
              ]}
            >
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={calculateTDEE}>
          <Text style={styles.buttonText}>Calculate TDEE</Text>
        </TouchableOpacity>
      </View>

      {tdee !== null && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your TDEE</Text>
          <Text style={styles.resultText}>{tdee.toFixed(2)} kcal/day</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FFF7',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00FFF7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#00FFF7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00FFF7',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00FFF7',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  optionList: {
    marginBottom: 15,
  },
  optionItem: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionItemSelected: {
    backgroundColor: '#00FFF7',
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00FFF7',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#0d0d0d',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FFF7',
    textAlign: 'center',
    marginTop: 10,
  },
});
