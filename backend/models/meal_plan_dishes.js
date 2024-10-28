const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class MealPlanDish extends Model {}

MealPlanDish.init(
  {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    mealPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "meal_plans", key: "id" },
      field: "meal_plan_id"
    },
    dishId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "dishes", key: "id" },
      field: "dish_id"
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "MealPlanDish",
  }
);

module.exports = MealPlanDish;
