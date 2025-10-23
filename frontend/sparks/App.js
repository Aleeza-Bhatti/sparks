import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "./screens/SplashScreen";
import PreferencesScreen from "./screens/PreferencesScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import ClothingScreen from "./screens/ClothingScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import AdditionalValuesScreen from "./screens/AdditionalValuesScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#F7B88E",
          height: 70,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color }) => {
          if (route.name === "Home")
            return <Ionicons name="home-outline" size={26} color={color} />;
          if (route.name === "Sparks")
            return <Ionicons name="sparkles-outline" size={26} color={color} />;
          if (route.name === "Profile")
            return <Ionicons name="person-outline" size={26} color={color} />;
        },
        tabBarActiveTintColor: "#C14625",
        tabBarInactiveTintColor: "#C14625",
      })}
    >
      <Tab.Screen name="Home" component={CategoriesScreen} />
      <Tab.Screen name="Sparks" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={() => null} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="Clothing" component={ClothingScreen} />
        <Stack.Screen name="AdditionalValues" component={AdditionalValuesScreen} />
        <Stack.Screen name="Main" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
