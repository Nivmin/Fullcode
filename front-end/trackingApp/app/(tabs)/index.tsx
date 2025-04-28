import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';

const API_URL = 'http://192.168.0.106:9000';

type WeightEntry = {
  id: number;
  user_id: number;
  weight: number;
  date: string;
};

export default function Home() {
  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const router = useRouter();

  const fetchWeights = async () => {
    const res = await axios.get<WeightEntry[]>(`${API_URL}/get_weights`);
    setWeights(res.data.reverse());
  };

  const addWeight = async () => {
    if (!weight) return;
    await axios.post(`${API_URL}/add_weight`, {
      user_id: 1,
      weight: parseFloat(weight),
    });
    setWeight('');
    fetchWeights();
  };

  const deleteWeight = async (id: number) => {
    await axios.delete(`${API_URL}/remove_weight/${id}`);
    fetchWeights();
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Weight Tracker</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        placeholder="Enter weight (kg)"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={addWeight}>
        <Text style={styles.buttonText}>➕ Add Weight</Text>
      </TouchableOpacity>

      <FlatList
        data={weights}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <AnimatePresence>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: index * 100 }}
              style={styles.card}
            >
              <Text style={styles.cardText}>
                {item.date} — {item.weight} kg
              </Text>
              <TouchableOpacity onPress={() => deleteWeight(item.id)}>
                <Text style={styles.delete}>✖</Text>
              </TouchableOpacity>
            </MotiView>
          </AnimatePresence>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ marginTop: 20 }}
      />

      <TouchableOpacity style={[styles.button, { marginTop: 30 }]} onPress={() => router.push('/chart')}>
        <Text style={styles.buttonText}>📊 View Chart</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 20,
    paddingTop: 60,
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
  input: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00C6FF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#00FFF7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#00FFF7',
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
  },
  delete: {
    fontSize: 20,
    color: '#ff4c4c',
  },
});

