const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class SavedDish extends Model {}

SavedDish.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  dishId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'dishes', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'saveddish'
})

module.exports = SavedDish