import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { GoalsProvider } from '../../contexts/GoalsContext'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native"

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login")
      }
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
  <GoalsProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2F5D50',   // deep green active
        tabBarInactiveTintColor: '#9E9E9E', // gray inactive
        tabBarStyle: {
          backgroundColor: '#F4F9F4', // soft bamboo green bg
          borderTopWidth: 1,
          borderTopColor: '#DDE5DC',
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bamboo Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? 'leaf' : 'leaf-outline'} // 🌱 Leaf for home
              color={focused ? '#2F5D50' : '#9E9E9E'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Add Item',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? 'add-circle' : 'add-circle-outline'} // ➕ Add circle
              color={focused ? '#2F5D50' : '#9E9E9E'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null, // hidden from tabs
        }}
      />
    </Tabs>
  </GoalsProvider>
)

}
