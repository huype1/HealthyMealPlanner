const {Model, DataTypes} = require("sequelize")
const {sequelize} = require("../utils/db")
const Dish = require("./dish")
class DishAllergy extends Model {}
DishAllergy.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    dishId: {
      type: DataTypes.INTEGER,
      references: {
        model: Dish,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    allergy: {
      type: DataTypes.ENUM(
        "gluten",
        "dairy",
        "nuts",
        "soy",
        "eggs",
        "fish",
        "shellfish"
      ),
      allowNull: false,
    },
  },
  {
    // sequelize,
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "DishAllergy",
  }
)

module.exports = DishAllergy