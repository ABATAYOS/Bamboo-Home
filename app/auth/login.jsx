import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Big Icon */}
      <Ionicons name="lock-closed" size={80} color="#2F5D50" style={styles.icon} />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.secondary]} onPress={() => router.push("/auth/signup")}>
        <Text style={styles.buttonText}>Go to Signup</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F4F9F4" },
  icon: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2F5D50", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
  },
  error: { color: "red", marginBottom: 10 },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#2F5D50",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  secondary: { backgroundColor: "#4CAF50" },
});
