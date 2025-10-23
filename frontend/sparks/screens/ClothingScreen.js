import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClothingScreen({ navigation }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState(true);
  const [showFirework, setShowFirework] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ✅ Fetch businesses from Cloudflare Worker
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(
          "https://sparks-worker.sparks-ai.workers.dev/businesses"
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load businesses");
        }

        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        Alert.alert(
          "Error",
          "Could not load businesses. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleSwipedRight = () => {
    setShowCards(false);
    setShowFirework(true);

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start(() => {
      setShowFirework(false);
      setShowCards(true);
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#FFE6C5", "#F7B88E"]} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#8A3E18" />
        <Text style={styles.loadingText}>Loading businesses...</Text>
      </LinearGradient>
    );
  }

  if (businesses.length === 0) {
    return (
      <LinearGradient colors={["#FFE6C5", "#F7B88E"]} style={styles.loaderContainer}>
        <Text style={styles.loadingText}>No businesses found.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFE6C5", "#F7B88E"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Clothing</Text>

        {showCards && (
          <View style={styles.swiperContainer}>
            <Swiper
              cards={businesses}
              renderCard={(card) =>
                card ? (
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{card.name}</Text>
                    <Text style={styles.cardDesc}>{card.description}</Text>

                    <View style={styles.tagContainer}>
                      {card.tags?.map((tag, i) => (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.imageRow}>
                      {card.images?.map((uri, i) => (
                        <Image
                          key={i}
                          source={{ uri }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.card}>
                    <Text>No more cards</Text>
                  </View>
                )
              }
              onSwipedRight={handleSwipedRight}
              onSwipedLeft={(i) => console.log("Swiped left on card", i)}
              stackSize={3}
              infinite
              animateCardOpacity
              cardVerticalMargin={0}
              backgroundColor="transparent"
              verticalSwipe={false}
            />
          </View>
        )}

        {showFirework && (
          <Animated.View style={[styles.fireworkOverlay, { opacity: fadeAnim }]}>
            <Image source={require("../assets/firework.gif")} style={styles.firework} />
            <Text style={styles.sparkText}>You’ve created a spark!</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Main", { screen: "Sparks" })}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 40, fontWeight: "700", color: "#8A3E18", marginTop: 85 },
  swiperContainer: {
    width: "100%",
    height: 480,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    backgroundColor: "#FFF2E6",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    height: 440,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3
  },
  cardTitle: { fontSize: 24, fontWeight: "700", color: "#8A3E18", marginBottom: 10 },
  cardDesc: {
    color: "#8A3E18",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 22
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 8
  },
  tag: {
    backgroundColor: "#C14625",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4
  },
  tagText: {
    color: "#FFF",
    fontWeight: "600"
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 8
  },
  image: { width: 100, height: 120, borderRadius: 10 },
  fireworkOverlay: {
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10
  },
  firework: { width: 380, height: 380 },
  sparkText: { color: "#8A3E18", fontSize: 20, fontWeight: "bold", marginTop: -10 },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: { fontSize: 18, color: "#C14625", fontWeight: "bold" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#8A3E18", marginTop: 12, fontSize: 16 }
});
