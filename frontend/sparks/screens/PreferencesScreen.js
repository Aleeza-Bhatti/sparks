// frontend/sparks/src/screens/PreferencesScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const VALUES = [
  { id: "ethical", label: "Ethically Sourced" },
  { id: "handmade", label: "Handmade" },
  { id: "bipoc", label: "BIPOC Owned" },
  { id: "local", label: "Local" },
  { id: "eco", label: "Eco-friendly" },
  { id: "affordable", label: "Affordable" },
];

export default function PreferencesScreen({ navigation }) {
  const [selected, setSelected] = useState([]);

  const toggleValue = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    navigation.navigate("AdditionalValues", { selectedValues: selected });
    //place holder
  };

  return (
    <LinearGradient
      colors={["#FFE6C5", "#F7B88E"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>What business values matter most to you?</Text>

        <View style={styles.grid}>
          {VALUES.map((item) => {
            const isOn = selected.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isOn && styles.cardSelected]}
                onPress={() => toggleValue(item.id)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: isOn }}
              >
                <Text style={[styles.cardText, isOn && styles.cardTextSelected]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const CARD_SIZE = 132;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: 110,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#8A3E18",
    textAlign: "center",
    marginBottom: 24,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  card: {
    width: "48%",                 // 2 per row
    height: CARD_SIZE,
    backgroundColor: "#FFEEDD",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: "#F7B88E",
    borderColor: "#8A3E18",
    borderWidth: 2,
  },
  cardImage: {
    // removed - icons are not used
  },
  cardText: {
    fontSize: 14,
    color: "#8A3E18",
    textAlign: "center",
    fontWeight: "600",
  },
  cardTextSelected: {
    color: "#6E2F12",
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#8A3E18",
  },
  buttonText: {
    fontSize: 18,
    color: "#8A3E18",
    fontWeight: "bold",
  },
});
