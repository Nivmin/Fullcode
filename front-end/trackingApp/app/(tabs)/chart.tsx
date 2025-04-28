import { useEffect, useState, useCallback } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.0.106:9000'; 

type ChartDataResponse = {
  dates: string[];
  weights: number[];
};

export default function ChartPage() {
  const [dates, setDates] = useState<string[]>([]);
  const [weights, setWeights] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchChartData = async () => {
        try {
          const res = await axios.get<ChartDataResponse>(`${API_URL}/chart_data`);
          setDates(res.data.dates);
          setWeights(res.data.weights);
        } catch (err) {
          console.error('Chart data fetch error:', err);
        }
      };

      fetchChartData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>🚀 Weight Trends</Text>
      {weights.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: dates,
              datasets: [{ data: weights }],
            }}
            width={Dimensions.get('window').width - 40}
            height={280}
            yAxisSuffix="kg"
            withShadow={false}
            withInnerLines={true}
            chartConfig={{
              backgroundGradientFrom: '#0d0d0d',
              backgroundGradientTo: '#1a1a1a',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(200, 200, 255, ${opacity})`,
              propsForBackgroundLines: {
                stroke: '#333',
              },
              propsForDots: {
                r: '6',
                strokeWidth: '3',
                stroke: '#00FFF7',
                fill: '#00FFF7',
              },
              propsForLabels: {
                fontSize: 12,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No futuristic data yet 🤖</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00FFF7',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#00FFF7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
  },
});

