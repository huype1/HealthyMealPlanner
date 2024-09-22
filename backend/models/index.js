const User = require("./user");
const UserAllergy = require("./user_allergies");
const Dish = require("./dish");

User.hasMany(UserAllergy);
UserAllergy.belongsTo(User);
User.hasMany(Dish);
Dish.belongsTo(User);
(async () => {
  await UserAllergy.sync({ alter: true });
  await User.sync({ alter: true });
  await Dish.sync({ alter: true });
})();

module.exports = {
  User,
  UserAllergy,
};
