import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, ScrollView, SafeAreaView, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const USDA_API_KEY = "K4xa8Fn2WX5c0CRI20OiTsB9eR7jacnAEFT1CXA6"; 
const USDA_SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

type FoodItem = {
  fdcId: number;
  description: string;
  foodNutrients: {
    nutrientName: string;
    value: number;
  }[];
};

export default function FoodTrackerPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [portion, setPortion] = useState(100);
  const [meals, setMeals] = useState<{ [key: string]: any[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const inputRef = useRef<TextInput>(null);

  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => { loadTodayMeals(); }, []);
  useEffect(() => { saveTodayMeals(); }, [meals]);

  const searchFood = async () => {
    try {
      const response = await axios.get(USDA_SEARCH_URL, {
        params: { query: query, api_key: USDA_API_KEY, pageSize: 10 },
      });
      if (typeof response.data === "object" && response.data !== null && "foods" in response.data) {
        setResults((response.data as { foods: any[] }).foods);
      }
    } catch (error) {
      console.error("Error fetching food data", error);
    }
  };

  const openAddFoodModal = (food: FoodItem) => {
    setSelectedFood(food);
    setPortion(100);
    setSelectedMeal("Breakfast");
    setModalVisible(true);
  };

  const addFoodToMeal = () => {
    if (!selectedFood) return;
    const caloriesPer100g = selectedFood.foodNutrients.find((n) => n.nutrientName === "Energy")?.value || 0;
    const calories = (caloriesPer100g * portion) / 100;

    const newFood = {
      name: selectedFood.description,
      calories: parseFloat(calories.toFixed(2)),
      portion,
    };

    setMeals((prev) => {
      const updatedMeal = prev[selectedMeal] ? [...prev[selectedMeal], newFood] : [newFood];
      return { ...prev, [selectedMeal]: updatedMeal };
    });

    setModalVisible(false);
    setQuery("");
    setResults([]);
    Keyboard.dismiss();
  };

  const saveTodayMeals = async () => {
    try {
      await AsyncStorage.setItem(todayKey, JSON.stringify(meals));
    } catch (e) {
      console.error("Failed to save meals", e);
    }
  };

  const loadTodayMeals = async () => {
    try {
      const saved = await AsyncStorage.getItem(todayKey);
      if (saved) setMeals(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load meals", e);
    }
  };

  const deleteFood = (mealType: string, index: number) => {
    setMeals((prev) => {
      const updatedMeal = [...(prev[mealType] || [])];
      updatedMeal.splice(index, 1);
      return { ...prev, [mealType]: updatedMeal };
    });
  };

  const totalCalories = Object.values(meals).flat().reduce((sum, item) => sum + item.calories, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🍽️ Food Tracker</Text>

        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            placeholder="Search for food..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={searchFood} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.fdcId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.foodCard}
              onPress={() => openAddFoodModal(item)}
            >
              <Text style={styles.foodName}>{item.description}</Text>
              <Text style={styles.foodCalories}>
                Calories/100g: {item.foodNutrients.find((n) => n.nutrientName === "Energy")?.value || 0}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.mealsContainer}>
          {MEALS.map((meal) => (
            <View key={meal} style={{ marginBottom: 20 }}>
              <Text style={styles.mealTitle}>{meal}</Text>
              {(meals[meal] || []).map((item, index) => (
                <View key={index} style={styles.mealItem}>
                  <View>
                    <Text style={styles.mealItemText}>{item.name} ({item.portion}g)</Text>
                    <Text style={styles.mealItemSubText}>{item.calories} kcal</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteFood(meal, index)}>
                    <Text style={styles.deleteText}>✖</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.totalCalories}>🔥 Total Calories: {totalCalories.toFixed(2)} kcal</Text>
      </ScrollView>

      {/* Add Food Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>➕ Add Food</Text>

            <Text style={styles.modalSubtitle}>Select Meal</Text>
            <View style={styles.mealOptions}>
              {MEALS.map((meal) => (
                <TouchableOpacity
                  key={meal}
                  onPress={() => setSelectedMeal(meal)}
                  style={[
                    styles.mealOptionButton,
                    selectedMeal === meal && styles.mealOptionSelected,
                  ]}
                >
                  <Text style={[
                    styles.mealOptionText,
                    selectedMeal === meal && { color: "#fff" },
                  ]}>
                    {meal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSubtitle}>Portion (grams)</Text>
            <TextInput
              value={portion.toString()}
              onChangeText={(text) => setPortion(Number(text))}
              keyboardType="numeric"
              placeholder="Enter grams"
              placeholderTextColor="#999"
              style={styles.portionInput}
            />

            <TouchableOpacity onPress={addFoodToMeal} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF6363", textAlign: "center", marginVertical: 20 },
  searchContainer: { flexDirection: "row", marginHorizontal: 20, marginBottom: 15 },
  searchInput: { flex: 1, backgroundColor: "#fff", color: "#1A1A1A", borderRadius: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: "#FF8282" },
  searchButton: { marginLeft: 10, backgroundColor: "#FF6363", paddingHorizontal: 20, borderRadius: 10, justifyContent: "center" },
  searchButtonText: { color: "#fff", fontWeight: "bold" },
  foodCard: { backgroundColor: "#fff", borderColor: "#DBFFCB", borderWidth: 1, borderRadius: 12, padding: 15, marginHorizontal: 20, marginVertical: 5 },
  foodName: { fontSize: 16, fontWeight: "bold", color: "#1A1A1A" },
  foodCalories: { fontSize: 14, color: "#666", marginTop: 4 },
  mealsContainer: { marginTop: 20, marginHorizontal: 20 },
  mealTitle: { fontSize: 22, fontWeight: "bold", color: "#FF6363", marginBottom: 10 },
  mealItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  mealItemText: { fontSize: 16, color: "#1A1A1A" },
  mealItemSubText: { fontSize: 14, color: "#666" },
  deleteText: { color: "#FF6363", fontWeight: "bold", fontSize: 20 },
  totalCalories: { fontSize: 22, color: "#FF6363", fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 25, borderRadius: 20, width: "90%" },
  modalTitle: { fontSize: 26, color: "#FF6363", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  modalSubtitle: { fontSize: 18, color: "#1A1A1A", fontWeight: "bold", marginTop: 10 },
  mealOptions: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  mealOptionButton: { backgroundColor: "#DBFFCB", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, margin: 5 },
  mealOptionSelected: { backgroundColor: "#BEE4D0" },
  mealOptionText: { fontWeight: "bold", color: "#1A1A1A" },
  portionInput: { backgroundColor: "#fff", color: "#1A1A1A", borderRadius: 10, padding: 10, marginTop: 10, marginBottom: 20, borderWidth: 1, borderColor: "#BEE4D0" },
  addButton: { backgroundColor: "#FF6363", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "#FF8282", padding: 15, borderRadius: 10, alignItems: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "bold" },
});
