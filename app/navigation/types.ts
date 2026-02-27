export type RootStackParamList = {
  Recipes: undefined;
  RecipeDetail: { id: string };
  Chat: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
