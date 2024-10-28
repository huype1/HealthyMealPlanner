const router = require("express").Router();
require('express-async-errors')
const {
  MealPlan,
  Dish,
  DishAllergy,
  MealPlanDish,
  User,
} = require("../models");
const { sequelize } = require("../utils/db");
const { tokenValidate } = require("../utils/middleware");
const { calculateMealPlanDetails } = require("../utils/calculateMealPlan");

router.post("/", tokenValidate, async (req, res) => {
  const { name, dishes, diet, description } = req.body;
  const userId = req.decodedToken.id;
  const transaction = await sequelize.transaction();
  try {
    if (dishes && dishes.length) {
      const dishRecords = await Dish.findAll({
        where: { id: dishes },
        include: [
          {
            model: DishAllergy,
            attributes: ["allergy"],
          },
        ],
        transaction,
      });

      const {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        combinedAllergies,
      } = calculateMealPlanDetails(dishRecords);

      const mealPlan = await MealPlan.create(
        {
          name,
          description,
          userId,
          diet,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          allergies: combinedAllergies,
        },
        { transaction }
      );

      const mealPlanDishes = dishes.map((dishId) => ({
        mealPlanId: mealPlan.id,
        dishId: dishId,
      }));
      const createdMealPlanDishes = await MealPlanDish.bulkCreate(
        mealPlanDishes,
        {
          transaction,
          returning: true,
        }
      );

      await transaction.commit();

      const createdMealPlan = await MealPlan.findByPk(mealPlan.id, {
        include: [
          {
            model: Dish,
            through: { attributes: [] },
          },
        ],
      });

      res.status(201).json(createdMealPlan);
    } else {
      throw new Error("No dishes provided for the meal plan");
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error in meal plan creation:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Get all Meal Plans for the authenticated user
router.get("/", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;

  try {
    const mealPlans = await MealPlan.findAll({
      where: { userId },
      include: {
        model: Dish,
        through: { attributes: [] },
      },
    });
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific Meal Plan by ID
router.get("/:id", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;
  const { id } = req.params;

  try {
    const mealPlan = await MealPlan.findOne({
      where: { id, userId },
      include: [
        {
          model: Dish,
          through: { attributes: [] },
        },
      ],
    });

    if (mealPlan) {
      res.json(mealPlan);
    } else {
      res.status(404).json({ error: "Meal Plan not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Meal Plan
router.put("/:id", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;
  const { id } = req.params;
  const { haveTried } = req.body;
  const newMealPlan = await MealPlan.findByPk(id);
  console.log(userId, "meal plan created", newMealPlan);
  if (userId !== newMealPlan.userId) {
    return res
      .status(403)
      .json({ error: "You are not authorized to edit this meal plan" });
  }
  newMealPlan.haveTried = haveTried;
  newMealPlan.save();
  return res.status(201).json(newMealPlan);
});
// Delete a Meal Plan
router.delete("/:id", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;
  const { id } = req.params;
  const { haveTried } = req.body;
  const mealPlan = await MealPlan.findByPk(id);
  if (!mealPlan) {
    await transaction.rollback();
    return res.status(404).json({ error: "Meal Plan not found" });
  }
  if (userId !== mealPlan.userId) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this meal plan" });
  }
  await mealPlan.destroy();
  return res.status(204).end();
});

module.exports = router;
