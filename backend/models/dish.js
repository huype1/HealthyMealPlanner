const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
class Dish extends Model {}

Dish.init(
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
    imageUrl: {
      type: DataTypes.STRING(255),
    },
    recipeUrl: {
      type: DataTypes.STRING(255),
    },
    calories: {
      type: DataTypes.INTEGER,
    },
    protein: {
      type: DataTypes.FLOAT,
    },
    fat: {
      type: DataTypes.FLOAT,
    },
    carb: {
      type: DataTypes.FLOAT,
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
    cuisine: {
      type: DataTypes.ENUM(
        "vietnamese",
        "korean",
        "japanese",
        "italian",
        "american",
        "mexican",
        "indian",
        "chinese",
        "thai",
        "others"
      ),
      allowNull: false,
    },
    dishType: {
      type: DataTypes.ENUM("main", "snack"),
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "dish",
  }
);
module.exports = Dish;
