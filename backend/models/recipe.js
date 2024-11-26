const {DataTypes, Model} = require("sequelize");
const {sequelize} = require("../utils/db");

class Recipe extends Model {
}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dishId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dishes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    timestamp: true,
    underscored: true,
    modelName: 'recipe'
  },
)
module.exports = Recipe