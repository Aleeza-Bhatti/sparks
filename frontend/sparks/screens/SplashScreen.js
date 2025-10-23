import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Quicksand_700Bold } from "@expo-google-fonts/quicksand";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({ Quicksand_700Bold });

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        if (navigation?.replace) navigation.replace("Preferences");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={["#FFE6C5", "#F7B88E"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.center}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>sparks</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -150,
  },
  logo: {
    width: 480,
    height: 480,
    marginBottom: -100,
  },
  text: {
    fontFamily: "Quicksand_700Bold",
    fontSize: 52,
    color: "#8A3E18",
    letterSpacing: 1,
  },
});
