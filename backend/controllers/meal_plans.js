const router = require("express").Router();
require("express-async-errors");
const {
  MealPlan,
  Dish,
  DishAllergy,
  MealPlanDish,

} = require("../models");
const { sequelize } = require("../utils/db");
const { tokenValidate } = require("../utils/middleware");
const { calculateMealPlanDetails } = require("../utils/calculateMealPlan");
const { Op } = require("sequelize");
router.post("/", tokenValidate, async (req, res) => {
  const {
    name,
    dishes,
    diet,
    description,
    isCalculated,
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
    allergies
  } = req.body;
  const userId = req.decodedToken.id;
  const transaction = await sequelize.transaction();

  try {
    if (dishes && dishes.length) {
      let calculatedCalories = totalCalories;
      let calculatedProtein = totalProtein;
      let calculatedCarbs = totalCarbs;
      let calculatedFat = totalFat;
      let combinedAllergies = [];

      if (isCalculated === false) {
        const dishRecords = await Dish.findAll({
          where: { id: dishes.map((dish) => dish.id) },
          include: [
            {
              model: DishAllergy,
              attributes: ["allergy"],
            },
          ],
          transaction,
        });

        const calculatedDetails = calculateMealPlanDetails(dishRecords);
        calculatedCalories = calculatedDetails.totalCalories;
        calculatedProtein = calculatedDetails.totalProtein;
        calculatedCarbs = calculatedDetails.totalCarbs;
        calculatedFat = calculatedDetails.totalFat;
        combinedAllergies = calculatedDetails.combinedAllergies;
      }

      const mealPlan = await MealPlan.create(
        {
          name,
          description,
          userId,
          diet,
          totalCalories: calculatedCalories,
          totalProtein: calculatedProtein,
          totalCarbs: calculatedCarbs,
          totalFat: calculatedFat,
          allergies: allergies.length===0 ? combinedAllergies: allergies,
        },
        { transaction }
      );

      const mealPlanDishes = dishes.map((dish) => ({
        mealPlanId: mealPlan.id,
        dishId: dish.dish.id,
        servings: dish.servings,
      }));

      await MealPlanDish.bulkCreate(mealPlanDishes, {
        transaction,
        returning: true,
      });

      await transaction.commit();

      const createdMealPlan = await MealPlan.findByPk(mealPlan.id, {
        include: [
          {
            model: Dish,
            through: { attributes: ["servings"] },
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

// Update a Meal Plan
router.put("/:id", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;
  const {
    name,
    dishes,
    diet,
    description,
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
    haveTried,
    isCalculated,
  } = req.body;

  console.log(req.body)
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const mealPlan = await MealPlan.findByPk(id, { transaction });
    if (!mealPlan) {
      throw new Error("Meal plan not found");
    }

    if (userId !== mealPlan.userId) {
      throw new Error("You are not authorized to edit this meal plan");
    }

    if (name !== undefined) mealPlan.name = name;
    if (description !== undefined) mealPlan.description = description;
    if (diet !== undefined) mealPlan.diet = diet;
    if (haveTried === true || haveTried === false) mealPlan.haveTried = haveTried;

    let calculatedCalories = totalCalories || mealPlan.totalCalories;
    let calculatedProtein = totalProtein || mealPlan.totalProtein;
    let calculatedCarbs = totalCarbs || mealPlan.totalCarbs;
    let calculatedFat = totalFat || mealPlan.totalFat;
    let combinedAllergies = [];

    if (dishes && dishes.length) {
      if (isCalculated === false) {
        const dishRecords = await Dish.findAll({
          where: { id: dishes.map((dish) => dish.dish.id) },
          include: [
            {
              model: DishAllergy,
              attributes: ["allergy"],
            },
          ],
          transaction,
        });

        const calculatedDetails = calculateMealPlanDetails(dishRecords);
        calculatedCalories = calculatedDetails.totalCalories;
        calculatedProtein = calculatedDetails.totalProtein;
        calculatedCarbs = calculatedDetails.totalCarbs;
        calculatedFat = calculatedDetails.totalFat;
        combinedAllergies = calculatedDetails.combinedAllergies;
      }

      await MealPlanDish.destroy({
        where: { mealPlanId: mealPlan.id },
        transaction,
      });

      const mealPlanDishes = dishes.map((dish) => ({
        mealPlanId: mealPlan.id,
        dishId: dish.dish.id,
        servings: dish.servings,
      }));

      await MealPlanDish.bulkCreate(mealPlanDishes, { transaction });
    }

    mealPlan.totalCalories = calculatedCalories;
    mealPlan.totalProtein = calculatedProtein;
    mealPlan.totalCarbs = calculatedCarbs;
    mealPlan.totalFat = calculatedFat;
    if (combinedAllergies.length) {
      mealPlan.allergies = combinedAllergies;
    }

    await mealPlan.save({ transaction });
    await transaction.commit();

    const updatedMealPlan = await MealPlan.findByPk(mealPlan.id, {
      include: [
        {
          model: Dish,
          through: { attributes: ["servings"] },
        },
      ],
    });

    res.status(200).json(updatedMealPlan);
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating meal plan:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Get all Meal Plans for the authenticated user
router.get("/", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;
  const {
    page = 1,
    name = "",
    diet = "",
    minCalories,
    maxCalories,
    limit = 5,
  } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = { userId };

  const searchValue = name.trim();
  if (searchValue !== "") {
    whereClause = {
      ...whereClause,
      [Op.or]: [
        { name: { [Op.iLike]: `%${searchValue}%` } },
        { description: { [Op.iLike]: `%${searchValue}%` } },
      ],
    };
  }

  if (diet !== "") {
    whereClause = {
      ...whereClause,
      [Op.and]: [{ diet: diet }],
    };
  }
  if (minCalories || maxCalories) {
    whereClause.totalCalories = {};
    if (minCalories) whereClause.totalCalories[Op.gte] = parseInt(minCalories);
    if (maxCalories) whereClause.totalCalories[Op.lte] = parseInt(maxCalories);
  }

  try {
    const { count, rows } = await MealPlan.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      distinct: true,
      order: [["id", "DESC"]],
      include: {
        model: Dish,
        through: { attributes: ["servings"] },
      },
    });

    const totalPages = Math.ceil(count / limit);
    res.json({ mealPlans: rows, totalPages });
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    res.status(500).json({ error: "Internal server error" });
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
          through: { attributes: ["servings"] },
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


// Delete a Meal Plan
router.delete("/:id", tokenValidate, async (req, res) => {
  const userId = req.decodedToken.id;
  const { id } = req.params;
  const mealPlan = await MealPlan.findByPk(id);
  if (!mealPlan) {
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
