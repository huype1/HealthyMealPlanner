const router = require("express").Router();
const { Op } = require("sequelize");
const {
  Dish,
  DishAllergy,
  User,
  SavedDish,
} = require("../models");
const { sequelize } = require("../utils/db");
const { tokenValidate } = require("../utils/middleware");

//create, read and delete the saved dishes.
//check if user save the dish or not
router.get("/:userId/:dishId", async (req, res) => {
  try {
    const { userId, dishId } = req.params;

    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const isDishSaved = await SavedDish.findOne({
      where: {
        userId: userId,
        dishId: dishId,
      },
    });

    const isSaved = !!isDishSaved;
    res.status(200).json({ isSaved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while checking saved dishes." });
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

    const userExists = await User.findByPk(parseInt(userId));
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const offset = (page - 1) * parseInt(limit);
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


    let excludeDishIds = [];
    if (allergies) {
      const allergyList = allergies.split(",");
      const savedDishIds = await SavedDish.findAll({
        attributes: ["dishId"],
        where: { userId: parseInt(userId) },
      }).then(saved => saved.map(s => s.dishId));

      if (savedDishIds.length > 0) {
        excludeDishIds = await DishAllergy.findAll({
          attributes: ["dishId"],
          where: {
            allergy: { [Op.in]: allergyList },
            dishId: { [Op.in]: savedDishIds },
          },
          group: ["dishId"],
        }).then(results => results.map(result => result.dishId));

        if (excludeDishIds.length > 0) {
          whereClause.id = { [Op.notIn]: excludeDishIds };
        }
      }
    }

    // Get total count first
    const totalCount = await User.findOne({
      where: { id: parseInt(userId) },
      attributes: [[sequelize.fn('COUNT', sequelize.col('dishes.id')), 'dishCount']],
      include: [{
        model: Dish,
        attributes: [],
        through: { attributes: [] },
        where: whereClause,
        required: true
      }],
      raw: true
    }).then(result => result?.dishCount || 0);


    const user = await User.findOne({
      where: { id: parseInt(userId) },
      include: [{
        model: Dish,
        through: { 
          model: SavedDish,
          attributes: []
        },
        where: whereClause,
        include: [{
          model: DishAllergy,
          attributes: ["allergy"]
        }],
        required: false
      }],
      limit: parseInt(limit),
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(totalCount / limit) || 1;
    
    res.json({
      dishes: user?.dishes || [],
      totalPages,
      currentPage: parseInt(page),
    });

  } catch (error) {
    console.error('Error:', error);
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
