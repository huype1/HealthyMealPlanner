function calculateMealPlanDetails(dishes) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  const allergies = new Set();

  dishes.forEach((dish) => {
    totalCalories += dish.calories || 0;
    totalProtein += dish.protein || 0;
    totalCarbs += dish.carbs || 0;
    totalFat += dish.fat || 0;
    dish.DishAllergies.forEach((allergy) => allergies.add(allergy.allergy));
  });

  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    combinedAllergies: [...new Set(allergies)],
  };
}

module.exports = { calculateMealPlanDetails };
