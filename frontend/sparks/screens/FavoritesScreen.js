import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // 🔹 Replace this mock data with Cloudflare KV fetch later
        const mockData = [
            {
                id: 1,
                name: "Eco Threads",
                tags: ["Eco-friendly", "Handmade", "Local"],
            },
            {
                id: 2,
                name: "Handmade Haven",
                tags: ["Ethically Sourced", "Handmade", "Local"],
            },
            {
                id: 3,
                name: "Roots & Co.",
                tags: ["Sustainable", "Local"],
            },
        ];
        setFavorites(mockData);
    }, []);

    return (
        <LinearGradient
            colors={["#FFE6C5", "#F7B88E"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.icon}>✨</Text>
                    <Text style={styles.title}>Sparks</Text>
                    <Text style={styles.subtitle}>
                        Businesses you’ve sparked a connection with
                    </Text>
                </View>

                {/* Business cards */}
                {favorites.map((biz) => (
                    <View key={biz.id} style={styles.card}>
                        <Text style={styles.bizName}>{biz.name}</Text>

                        <View style={styles.tags}>
                            {biz.tags.map((tag, i) => (
                                <View key={i} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag} ✓</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: {
        alignItems: "center",
        paddingVertical: 30,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: "center",
        marginBottom: 50,
    },
    icon: {
        fontSize: 40,
        color: "#C14625",
        marginTop: 50,     
        marginBottom: 20,  
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#8A3E18",
    },
    subtitle: {
        fontSize: 15,
        color: "#8A3E18",
        textAlign: "center",
        marginTop: 6,
    },
    card: {
        backgroundColor: "#FFF2E6",
        borderRadius: 16,
        padding: 20,
        width: "90%",
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    bizName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#8A3E18",
        marginBottom: 10,
    },
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
    },
    tag: {
        backgroundColor: "#C14625",
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    tagText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
    },
});
