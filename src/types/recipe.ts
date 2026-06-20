export interface Recipe {
  id: number;
  tag: string;
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

  ingredients: Record<string, string[]>;

  instructions: {
    step: number;
    title: string;
    description: string;
    time: string;
    image?: string;
  }[];

  tips: string[];

  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };

  tags: string[];
}
