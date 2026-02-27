import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../../theme";
import { fetchRecipe } from "../../api/recipes";
import type { Recipe } from "../../api/recipes";
import type { RootStackParamList } from "../../navigation/types";
import { styles } from "./RecipeDetailScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "RecipeDetail">;

export function RecipeDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecipe(id);
      setRecipe(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Recipe not found"}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollInner}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{recipe.name}</Text>
      </View>

      {recipe.description ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>
      ) : null}

      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ing, i) => (
              <Text key={i} style={styles.ingredient}>
                • {ing}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      {recipe.instructions ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{recipe.instructions}</Text>
        </View>
      ) : null}

      {recipe.tags && recipe.tags.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tags}>
            {recipe.tags.map((tag, i) => (
              <Text key={i} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
