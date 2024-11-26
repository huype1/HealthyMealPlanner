const {tokenValidate} = require("../utils/middleware");
const router = require("express").Router();
const {User, UserAllergy, DishAllergy, Dish} = require("../models");
const {Op} = require("sequelize");

// Get all dishes, including their allergies and the user who saved them.
router.get('/', tokenValidate, async (req, res) => {
  try {
    const userId = req.decodedToken.id;

    const limit = 4;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserAllergy,
          attributes: ['allergy'],
        },
      ],
    });


    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }


    const allergies = user.UserAllergies
      ? user.UserAllergies.map(ua => ua.allergy)
      : [];

    let includeClause = [
      {
        model: DishAllergy,
        attributes: ["allergy"],
      },
    ];


    const whereClause = {
      diet: {[Op.eq]: user.diet}
    };

    const allDishIds = await Dish.findAll({
      attributes: ['id'],
      where: whereClause,
    }).then(dishes => dishes.map(dish => dish.id));

    const dishIdsWithAllergies = await DishAllergy.findAll({
      attributes: ['dishId'],
      where: {
        allergy: {[Op.in]: allergies},
        dishId: {[Op.in]: allDishIds},
      },
      group: ['dishId'],
    }).then(results => results.map(result => result.dishId));

    const {count, rows: suggestedDishes} = await Dish.findAndCountAll({
      where: {
        ...whereClause,
        id: {[Op.notIn]: dishIdsWithAllergies || []},
      },
      order: [['id', 'DESC']],
      include: includeClause,
      limit,
      distinct: true,
    });

    res.json(suggestedDishes.map(dish => ({servings: 1, dish}))
    );

  } catch (error) {
    console.error('Suggestion Error:', error);
    res.status(500).json({
      message: 'Error generating dish suggestions',
      error: error.message
    });
  }
});


module.exports = router;
