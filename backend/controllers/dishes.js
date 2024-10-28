const router = require("express").Router();
const { Dish, DishAllergy, User } = require("../models");
const { sequelize } = require("../utils/db");
const { Op } = require("sequelize");
const { tokenValidate } = require("../utils/middleware");

router.get("/", async (req, res) => {
  const {
    diet,
    allergies,
    name,
    minCalories,
    maxCalories,
    mealType,
    cuisine,
    userId,
    page = 1,
    limit = 10,
  } = req.query;
  const offset = (page - 1) * limit;
  let whereClause = {};
  let includeClause = [
    {
      model: DishAllergy,
      attributes: ["allergy"],
    },
    {
      model: User,
      attributes: ["id", "userName", "fullName"],
      where: userId ? { id: userId } : null,
    },
  ];

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
  let result = {};

  try {
    if (allergies) {
      const allergyList = allergies.split(",");

      // First, get all dish IDs
      const allDishIds = await Dish.findAll({
        attributes: ["id"],
        where: whereClause,
      }).then((dishes) => dishes.map((dish) => dish.id));

      // Then, get dish IDs that have any of the specified allergies
      const dishIdsWithAllergies = await DishAllergy.findAll({
        attributes: ["dishId"],
        where: {
          allergy: { [Op.in]: allergyList },
          dishId: { [Op.in]: allDishIds },
        },
        group: ["dishId"],
      }).then((results) => results.map((result) => result.dishId));

      // Finally, get all dishes that are not in the dishIdsWithAllergies array
      result = await Dish.findAndCountAll({
        where: {
          ...whereClause,
          id: { [Op.notIn]: dishIdsWithAllergies },
        },
        limit,
        offset,
        order: [["id", "DESC"]],
        include: includeClause,
        distinct: true,
      });
    } else {
      result = await Dish.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [["id", "DESC"]],
        include: includeClause,
        distinct: true,
      });
    }
    const totalPages = Math.ceil(result.count / limit);
    res.json({ dishes: result.rows, totalPages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", tokenValidate, async (req, res) => {
  const { DishAllergies, ...dishData } = req.body;
  const allergies = DishAllergies.map(al => al.allergy)
  const transaction = await sequelize.transaction();

  try {
    // Create the dish first
    const dish = await Dish.create(dishData, { transaction });

    if (allergies && allergies.length) {
      const allergyObjects = allergies.map(allergy => ({
        dishId: dish.id,
        allergy
      }));

      await DishAllergy.bulkCreate(allergyObjects, { transaction });
    }

    // Format the response data
    const objectAllergies = allergies
      ? allergies.map(allergy => ({ allergy }))
      : [];

    // Commit the transaction
    await transaction.commit();

    // Send the response
    res.status(201).json({
      ...dish.toJSON(),
      DishAllergy: objectAllergies
    });

  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error('Error creating dish:', error);
    res.status(500).json({
      error: error.message,
      details: 'Error occurred while creating dish and allergies'
    });
  }
});

router.get("/:id", async (req, res) => {
  const dish = await Dish.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ["id", "userName", "fullName", "email", "status"],
      },
      {
        model: DishAllergy,
        attributes: ["allergy"],
      },
    ],
  });
  if (dish) {
    res.json(dish);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", tokenValidate, async (req, res) => {
  const transaction = await sequelize.transaction();
  const {  DishAllergies, ...newDishData } = req.body;
  const allergies = DishAllergies?DishAllergies.map(allergy => allergy.allergy): []
  const dish = await Dish.findByPk(req.params.id, { transaction });
  if (!dish) {
    return res.status(404).json({ error: "Dish not found" });
  } else {
    try {
      await dish.update(newDishData, { transaction });
      if (allergies && allergies.length) {
        await DishAllergy.destroy({
          where: { dishId: dish.id },
          transaction,
        });

        const allergyPromises = allergies.map((allergy) =>
          DishAllergy.create({ dishId: dish.id, allergy }, { transaction })
        );
        await Promise.all(allergyPromises);
      }

      const objectAllergies = allergies
        ? allergies.map((allergy) => ({ allergy }))
        : [];

      await transaction.commit();
      res.json({ ...dish.toJSON(), UserAllergies: objectAllergies });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
});

router.delete("/:id", tokenValidate, async (req, res) => {
  const transaction = await sequelize.transaction();
  const dish = await Dish.findByPk(req.params.id);
  if (dish) {
    if (
      dish.userId !== req.decodedToken.id
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this dish" });
    }
    try {
      await Dish.destroy({
        where: { id: req.params.id },
        transaction,
      });
      await transaction.commit();
      res.status(204).json();
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "Dish doesn't exist" });
  }
});

router.get("/:dishId/allergies", async (req, res) => {
  const { dishId } = req.params;
  const dishAllergy = await DishAllergy.findAll({
    where: { dishId: dishId },
  });

  res.json(dishAllergy);
});

router.put("/:dishId/allergies", tokenValidate, async (req, res) => {
  const { dishId } = req.params;
  const { allergies } = req.body;

  try {
    // Delete existing allergies
    await DishAllergy.destroy({
      where: { dishId: dishId },
    });

    // Add new allergies
    const allergyPromises = allergies.map((allergy) =>
      DishAllergy.create({ dishId: dishId, allergy })
    );
    await Promise.all(allergyPromises);

    res.status(200).json({ message: "Allergies updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
