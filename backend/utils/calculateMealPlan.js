function calculateMealPlanDetails(dishes) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  const allergies = new Set();

  dishes.forEach((dish) => {
    totalCalories += dish.calories*dish.servings || 0;
    totalProtein += dish.protein *dish.servings|| 0;
    totalCarbs += dish.carb *dish.servings|| 0;
    totalFat += dish.fat *dish.servings|| 0;
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
function calculateTargetCalories(user) {
  const { weight, height, age, activityLevel, weightGoal } = user;
  const bmr = 10 * weight + 6.25 * height - 5 * age;

  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const caloriesWithActivity = bmr * (activityFactors[activityLevel] || 1.2);

  // Step 3: Adjust for Weight Goal
  let targetCalories = caloriesWithActivity;
  if (weightGoal === "lose") targetCalories -= 500;
  else if (weightGoal === "gain") targetCalories += 500;

  // Return the rounded result
  return Math.round(targetCalories);
}
module.exports = { calculateMealPlanDetails, calculateTargetCalories };
