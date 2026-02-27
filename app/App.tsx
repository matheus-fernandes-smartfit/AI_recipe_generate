import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecipesScreen } from "./screens/RecipesScreen";
import { RecipeDetailScreen } from "./screens/RecipeDetailScreen";
import { ChatScreen } from "./screens/ChatScreen";
import type { RootStackParamList } from "./navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Recipes"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8F6F2", padding: 12 },

          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Recipes" component={RecipesScreen} />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ animation: "slide_from_right" }}
        />
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
