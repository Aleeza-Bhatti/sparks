/*

TODO:
1) ADD ICONS TO ASSETS
2) UNCOMMENT CODE
3) MAKE SURE THE DESIGN LOOKS GOOD STILL

*/

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet /*, Image */ } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

// Commented out icons for now
// import clothingIcon from "../assets/clothing.png";
// import jewelryIcon from "../assets/jewelry.png";
// import bagsIcon from "../assets/bag.png";
// import footwearIcon from "../assets/shoes.png";

export default function CategoriesScreen({ navigation, route }) {
    const { userName } = route.params || {};
    const displayName = userName || "User";

    const categories = [
        { id: "clothing", label: "Clothing" /*, icon: clothingIcon */ },
        { id: "jewelry", label: "Jewelry" /*, icon: jewelryIcon */ },
        { id: "bags", label: "Bags" /*, icon: bagsIcon */ },
        { id: "footwear", label: "Footwear" /*, icon: footwearIcon */ },
    ];

    const handleCategoryPress = (categoryId) => {
        if (categoryId === "clothing") {
            navigation.navigate("Clothing");
        } else {
            console.log(`Clicked ${categoryId} (placeholder)`);
        }
    };

    return (
        <LinearGradient
            colors={["#FFE6C5", "#F7B88E"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.center}>
                <Text style={styles.title}>Welcome, {displayName}!</Text>

                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={styles.card}
                        onPress={() => handleCategoryPress(cat.id)}
                    >
                        {/* <Image source={cat.icon} style={styles.icon} resizeMode="contain" /> */}
                        <Text style={styles.cardText}>{cat.label}</Text>
                    </TouchableOpacity>
                ))}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#8A3E18",
        textAlign: "center",
        marginBottom: 40,
    },
    card: {
        width: "85%",
        backgroundColor: "#C14625",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    /* icon: {
      width: 50,
      height: 50,
      marginRight: 20,
    }, */
    cardText: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "600",
    },
});
