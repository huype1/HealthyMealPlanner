const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const User = require("./user");
class UserAllergy extends Model {}
UserAllergy.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "SET NULL",
      onDelete: "SET NULL",
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
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "UserAllergy",
  }
);

module.exports = UserAllergy;
