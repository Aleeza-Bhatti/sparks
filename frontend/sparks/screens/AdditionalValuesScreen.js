import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function AdditionalValuesScreen({ navigation, route }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const selectedValues = route.params?.selectedValues || [];

    const handleDone = async () => {
        Keyboard.dismiss(); // Close keyboard immediately when user submits

        if (selectedValues.length === 0 && !input.trim()) {
            Alert.alert("Wait!", "Please select at least one value or enter something before submitting.");
            return;
        }

        setLoading(true);

        try {
            // Save preferences
            const prefResponse = await fetch("https://sparks-worker.sparks-ai.workers.dev/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "user123",
                    values: selectedValues,
                    extra: input
                }),
            });

            if (!prefResponse.ok) {
                const errData = await prefResponse.json();
                throw new Error(errData.error || "Failed to save preferences");
            }

            // Match request
            const matchResponse = await fetch("https://sparks-worker.sparks-ai.workers.dev/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: "user123" }),
            });

            const matchData = await matchResponse.json();
            setLoading(false);

            if (matchResponse.ok && matchData.matches) {
                navigation.navigate("Clothing", { aiMatches: matchData.matches });
            } else {
                Alert.alert("Error", matchData.error || "No matches found.");
            }
        } catch (err) {
            console.error("Error during submission:", err);
            setLoading(false);
            Alert.alert("Error", err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient colors={["#FFE6C5", "#F7B88E"]} style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Any other values not listed?</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Insert text..."
                        value={input}
                        onChangeText={setInput}
                        multiline
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleDone}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>{loading ? "Matching..." : "Done"}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    title: { fontSize: 22, color: "#8A3E18", textAlign: "center", marginBottom: 20 },
    input: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        width: "90%",
        height: 200,
        textAlignVertical: "top",
        padding: 16,
        fontSize: 16,
        color: "#8A3E18",
        marginBottom: 30,
        elevation: 3,
    },
    button: {
        backgroundColor: "#fff",
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: { fontSize: 18, color: "#C14625", fontWeight: "bold" },
});
