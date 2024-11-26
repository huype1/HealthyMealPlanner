const {DataTypes, Model} = require("sequelize");
const { sequelize } = require("../utils/db");
class Comment extends Model {}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull:false,
    validate: {
      min: 0,
      max: 5,
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  dishId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'dishes',
      key: 'id'
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
},
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'comment',
  },
)
module.exports = Comment