const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    weight: DataTypes.DECIMAL(5, 2),
    height: DataTypes.DECIMAL(5, 2),
    age: DataTypes.INTEGER,
    activityLevel: DataTypes.ENUM("sedentary", "light", "moderate", "active"),
    weightGoal: DataTypes.ENUM("lose", "maintain", "gain"),
    diet: DataTypes.ENUM(
      "vegan",
      "vegetarian",
      "keto",
      "high-protein",
      "low-fat",
      "low-carb",
      "balanced",
      "high-fiber"
    ),
    status: {
      type: DataTypes.ENUM("active", "locked", "admin"),
      defaultValue: "active",
    },
    targetCalories: DataTypes.INTEGER,
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "user",
  }
);
module.exports = User;
