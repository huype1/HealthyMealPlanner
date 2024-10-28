const User = require("./user");
const UserAllergy = require("./user_allergies");
const Dish = require("./dish");
const DishAllergy = require("./dish_allergies");
const SavedDish = require("./saved_dish");
const Session = require("./session");
const MealPlan = require("./meal_plan");
const MealPlanDish = require("./meal_plan_dishes");
User.hasMany(UserAllergy);
UserAllergy.belongsTo(User);
User.hasMany(Dish);
Dish.belongsTo(User, {
  onDelete: 'SET NULL'
});
Dish.hasMany(DishAllergy);
DishAllergy.belongsTo(Dish);

User.belongsToMany(Dish, { through: SavedDish });
Dish.belongsToMany(User, { through: SavedDish });

User.hasMany(MealPlan);
MealPlan.belongsTo(User);

MealPlan.belongsToMany(Dish, {
  through: MealPlanDish,
  foreignKey: "mealPlanId",
});
Dish.belongsToMany(MealPlan, { through: MealPlanDish, foreignKey: "dishId" });
User.hasMany(Session, { foreignKey: "userId" });
(async () => {
  await SavedDish.sync({ alter: true });
  await UserAllergy.sync({ alter: true });
  await User.sync({ alter: true });
  await Dish.sync({ alter: true });
  await DishAllergy.sync({ alter: true });
  await Session.sync({ alter: true });
  await MealPlan.sync({ alter: true });
  await MealPlanDish.sync({ alter: true });
})();

module.exports = {
  User,
  UserAllergy,
  Dish,
  DishAllergy,
  SavedDish,
  Session,
  MealPlan,
  MealPlanDish,
};
