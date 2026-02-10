export type Instruction = {
  step: number;
  title: string;
  description: string;
  time: string;
  image: string;
};

export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type IngredientsGroup = {
  [category: string]: string[];
};

export type Recipe = {
  id: number;
  title: string;
  description: string;
  image: string;
  videoUrl: string;
  duration: string;
  difficulty: string;
  servings: string;
  category: string;
  rating: number;
  views: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  ingredients: IngredientsGroup;
  instructions: Instruction[];
  tips: string[];
  nutrition: Nutrition;
  tags: string[];
};
