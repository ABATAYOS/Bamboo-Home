import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2F5D50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Leaf Icon */}
      <Ionicons name="leaf" size={80} color="#2F5D50" style={styles.icon} />

      {/* Welcome Title */}
      <Text style={styles.title}>Bamboo Home</Text>
      <Text style={styles.subtitle}>Organize your bamboo items with ease</Text>

      {/* Actions */}
      <Pressable style={styles.button} onPress={() => router.push("/goals")}>
        <Text style={styles.buttonText}>View Items</Text>
      </Pressable>

      <Pressable style={[styles.button, { backgroundColor: "#4CAF50" }]} onPress={() => router.push("/goals/create")}>
        <Text style={styles.buttonText}>Add New Item</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9F4", // soft bamboo green background
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2F5D50", // deep green
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#2F5D50",
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Home;
