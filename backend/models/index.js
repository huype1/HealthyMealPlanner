const User = require("./user");
const UserAllergy = require("./user_allergies");
const Dish = require("./dish");
const DishAllergy = require("./dish_allergies");
const SavedDish = require("./saved_dish");
const Session = require("./session");
const MealPlan = require("./meal_plan");
const MealPlanDish = require("./meal_plan_dishes");
const Comment = require("./comment");
const Recipe = require("./recipe");
User.hasMany(UserAllergy);
UserAllergy.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
User.hasMany(Dish, { foreignKey: 'userId' });
Dish.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

SavedDish.belongsTo(Dish, {
  foreignKey: 'dishId',
  onDelete: 'CASCADE',
});

Dish.hasMany(SavedDish, {
  foreignKey: 'dishId',
});
SavedDish.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

User.hasMany(SavedDish, {
  foreignKey: 'userId',
});
Dish.hasMany(DishAllergy);
DishAllergy.belongsTo(Dish);

User.belongsToMany(Dish, { through: SavedDish });
Dish.belongsToMany(User, { through: SavedDish });

User.hasMany(MealPlan, { foreignKey: 'userId' });
MealPlan.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

MealPlan.belongsToMany(Dish, {
  through: MealPlanDish,
  foreignKey: "mealPlanId",
});
Dish.belongsToMany(MealPlan, { through: MealPlanDish, foreignKey: "dishId" });

User.hasMany(Session, { foreignKey: "userId" });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Dish.hasMany(Comment, { foreignKey: 'dishId'});
Comment.belongsTo(Dish, {
  foreignKey: 'dishId',
  onDelete: 'CASCADE',
});

Dish.hasMany(Recipe, {foreignKey: 'dishId'});
Recipe.belongsTo(Dish, {
  foreignKey: 'dishId',
  onDelete: 'CASCADE',
});

(async () => {
  await SavedDish.sync({ alter: true });
  await UserAllergy.sync({ alter: true });
  await User.sync({ alter: true });
  await Dish.sync({ alter: true });
  await DishAllergy.sync({ alter: true });
  await Session.sync({ alter: true });
  await MealPlan.sync({ alter: true });
  await MealPlanDish.sync({ alter: true });
  await Comment.sync({alter: true});
  await Recipe.sync({alter: true})
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
  Comment,
  Recipe,
};
