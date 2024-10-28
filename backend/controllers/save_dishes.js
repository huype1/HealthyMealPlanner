const router = require("express").Router();
const { Op } = require("sequelize");
const {
  Dish,
  DishAllergy,
  User,
  UserAllergy,
  SavedDish,
} = require("../models");
const { sequelize } = require("../utils/db");
const { isAdmin, tokenValidate } = require("../utils/middleware");

//create, read and delete the saved dishes.
router.get("/:userId/:dishId", async (req, res) => {
  try {
    const { userId, dishId } = req.params;
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Dish,
          through: SavedDish,
          where: {
            id: {
              [Op.eq]: dishId,
            },
          },
          include: [
            {
              model: DishAllergy,
              attributes: ["allergy"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Can't find saved dishes from users" });
  }
});

router.get("/:userId", tokenValidate, async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      diet,
      allergies,
      name,
      minCalories,
      maxCalories,
      mealType,
      cuisine,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = {};

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name.toLowerCase()}%` };
    }
    if (minCalories || maxCalories) {
      whereClause.calories = {};
      if (minCalories) whereClause.calories[Op.gte] = parseInt(minCalories);
      if (maxCalories) whereClause.calories[Op.lte] = parseInt(maxCalories);
    }
    if (mealType) {
      whereClause.dishType = mealType;
    }
    if (cuisine) {
      whereClause.cuisine = cuisine;
    }
    if (diet) {
      whereClause.diet = diet;
    }

    let includeClause = [
      {
        model: Dish,
        through: SavedDish,
        where: whereClause,
        include: [
          {
            model: DishAllergy,
            attributes: ["allergy"],
          },
        ],
      },
    ];

    if (allergies) {
      const allergyList = allergies.split(",");

      const savedDishIds = await SavedDish.findAll({
        attributes: ["dishId"],
        where: { userId },
      }).then((saved) => saved.map((s) => s.dishId));

      const dishIdsWithAllergies = await DishAllergy.findAll({
        attributes: ["dishId"],
        where: {
          allergy: { [Op.in]: allergyList },
          dishId: { [Op.in]: savedDishIds },
        },
        group: ["dishId"],
      }).then((results) => results.map((result) => result.dishId));

      includeClause[0].where.id = { [Op.notIn]: dishIdsWithAllergies };
    }

    const totalCount = await User.count({
      where: { id: userId },
      include: [
        {
          model: Dish,
          through: SavedDish,
          where: whereClause,
          required: true,
        },
      ],
      distinct: true,
    }); 
    console.log(userId, totalCount)
    const user = await User.findByPk(userId, {
      include: includeClause,
      limit,
      offset,
      distinct: true,
    });
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      dishes: user.dishes,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Can't find saved dishes from users" });
  }
});
router.delete("/:userId/:dishId", tokenValidate, async (req, res) => {
  const { userId, dishId } = req.params;
  console.log(req.decodedToken);
  if (parseInt(userId) !== parseInt(req.decodedToken.id)) {
    return res
      .status(403)
      .json({ error: "You are not authorized to edit this" });
  }
  try {
    const result = await SavedDish.destroy({ where: { userId, dishId } });
    if (result) {
      res.status(204).json({ message: "Dish removed successfully" });
    } else {
      res.status(404).json({ error: "Dish not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to remove dish" });
  }
});

router.post("/", async (req, res) => {
  const { userId, dishId } = req.body;

  try {
    const newDish = await SavedDish.create({ userId, dishId });

    res.status(201).json(newDish);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add dish" });
  }
});

module.exports = router;
