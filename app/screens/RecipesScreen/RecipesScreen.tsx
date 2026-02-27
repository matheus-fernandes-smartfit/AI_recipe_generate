import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Recipe, fetchRecipes, createRecipe, CreateRecipePayload } from "../../api/recipes";
import type { RootStackParamList } from "../../navigation/types";
import { theme } from "../../theme";
import { styles } from "./RecipesScreen.styles";

export function RecipesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Recipes">>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState<string[]>([""]);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && !creating,
    [name, creating]
  );

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setIngredients([""]);
    setInstructions("");
    setTags([""]);
  }, []);

  const addIngredient = useCallback(() => {
    setIngredients((prev) => [...prev, ""]);
  }, []);

  const setIngredient = useCallback((index: number, value: string) => {
    setIngredients((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setIngredients((prev) => (prev.length <= 1 ? [""] : prev.filter((_, i) => i !== index)));
  }, []);

  const addTag = useCallback(() => {
    setTags((prev) => [...prev, ""]);
  }, []);

  const setTag = useCallback((index: number, value: string) => {
    setTags((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const removeTag = useCallback((index: number) => {
    setTags((prev) => (prev.length <= 1 ? [""] : prev.filter((_, i) => i !== index)));
  }, []);

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await fetchRecipes();
      setRecipes(list);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  const handleCreateRecipe = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter the recipe name.");
      return;
    }

    try {
      setCreating(true);
      const payload: CreateRecipePayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        ingredients: ingredients.map((s) => s.trim()).filter(Boolean),
        instructions: instructions.trim() || undefined,
        tags: tags.map((s) => s.trim()).filter(Boolean) || undefined,
      };
      await createRecipe(payload);
      setCreateOpen(false);
      resetForm();
      await loadRecipes();
    } catch (e: unknown) {
      Alert.alert("Error creating recipe", (e as Error)?.message ?? "Failed to create recipe");
    } finally {
      setCreating(false);
    }
  }, [
    name,
    description,
    ingredients,
    instructions,
    tags,
    loadRecipes,
    resetForm,
  ]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recipes</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate("Chat")}
            >
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fab} onPress={() => setCreateOpen(true)}>
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.muted}>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>Failed</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.muted}>Is the backend running on :3001?</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={recipes.length ? undefined : styles.center}
            ListEmptyComponent={
              <Text style={styles.muted}>No recipes yet. Tap "+" to add one.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("RecipeDetail", { id: item.id })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
                {!!item.description && (
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                {!!item.tags?.length && (
                  <Text style={styles.cardTags}>#{item.tags.join(" #")}</Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>

      <Modal
        visible={createOpen}
        animationType="slide"
        onRequestClose={() => setCreateOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New recipe</Text>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => {
                setCreateOpen(false);
                resetForm();
              }}
              disabled={creating}
            >
              <Text style={styles.smallButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.form}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Omelette"
              placeholderTextColor={theme.colors.textMuted}
              editable={!creating}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="A short description..."
              placeholderTextColor={theme.colors.textMuted}
              editable={!creating}
            />
            <Text style={styles.label}>Ingredients</Text>
            {ingredients.map((value, index) => (
              <View key={index} style={styles.ingredientRow}>
                <TextInput
                  style={styles.ingredientInput}
                  value={value}
                  onChangeText={(text) => setIngredient(index, text)}
                  placeholder="e.g. 2 eggs"
                  placeholderTextColor={theme.colors.textMuted}
                  editable={!creating}
                />
                <TouchableOpacity
                  style={styles.removeIngredientButton}
                  onPress={() => removeIngredient(index)}
                  disabled={creating || ingredients.length <= 1}
                  accessibilityLabel="Remove ingredient"
                >
                  <Text style={styles.removeIngredientText}>−</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addIngredientButton, creating && { opacity: 0.6 }]}
              onPress={addIngredient}
              disabled={creating}
            >
              <View style={styles.addIngredientIcon}>
                <Text style={styles.addIngredientIconText}>+</Text>
              </View>
              <Text style={styles.addIngredientText}>Add ingredient</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Instructions</Text>
            <TextInput
              style={styles.inputMultiline}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Step by step..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              editable={!creating}
            />
            <Text style={styles.label}>Tags</Text>
            {tags.map((value, index) => (
              <View key={index} style={styles.ingredientRow}>
                <TextInput
                  style={styles.ingredientInput}
                  value={value}
                  onChangeText={(text) => setTag(index, text)}
                  placeholder="e.g. quick"
                  placeholderTextColor={theme.colors.textMuted}
                  editable={!creating}
                />
                <TouchableOpacity
                  style={styles.removeIngredientButton}
                  onPress={() => removeTag(index)}
                  disabled={creating || tags.length <= 1}
                  accessibilityLabel="Remove tag"
                >
                  <Text style={styles.removeIngredientText}>−</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addIngredientButton, creating && { opacity: 0.6 }]}
              onPress={addTag}
              disabled={creating}
            >
              <View style={styles.addIngredientIcon}>
                <Text style={styles.addIngredientIconText}>+</Text>
              </View>
              <Text style={styles.addIngredientText}>Add tag</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
              onPress={handleCreateRecipe}
              disabled={!canSubmit}
            >
              <Text style={styles.primaryButtonText}>
                {creating ? "Creating..." : "Create recipe"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
