const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class MealPlan extends Model {}

MealPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: 'CASCADE',
    },
    totalCalories: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalProtein: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalFat: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalCarbs: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    haveTried: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    diet: {
      type: DataTypes.ENUM(
        "vegan",
        "vegetarian",
        "keto",
        "high-protein",
        "low-fat",
        "low-carb",
        "balanced",
        "high-fiber"
      ),
      allowNull: false,
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "MealPlan",
  }
);
module.exports = MealPlan;
