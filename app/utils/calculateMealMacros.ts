import { Macros, FoodItems } from "../types/types";

export const calculateMealMacros = (selectedFoods: FoodItems[]): Macros => {
  return selectedFoods.reduce(
    (totals, food) => {
      const amount = food.amount ?? 0;
      const portion = amount / 100;
      return {
        calories: totals.calories + food.per100g.calories * portion,
        protein: totals.protein + food.per100g.protein * portion,
        carbohydrates:
          totals.carbohydrates + food.per100g.carbohydrates * portion,
        fat: totals.fat + food.per100g.fat * portion,
        fiber: totals.fiber + food.per100g.fiber * portion,
        sugar: totals.sugar + food.per100g.sugar * portion,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    }
  );
};
