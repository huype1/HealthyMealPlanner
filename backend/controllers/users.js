const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, UserAllergy, Dish, DishAllergy } = require("../models");
const { sequelize } = require("../utils/db");
const { Op, where } = require("sequelize");
const { userFinder, tokenValidate, isAdmin } = require("../utils/middleware");
//user specific function

router.post("/", async (req, res) => {
  const { allergies, ...userData } = req.body;
  const saltRounds = 10;
  const passwordHashed = await bcrypt.hash(userData.passwordHash, saltRounds);

  const transaction = await sequelize.transaction();

  try {
    const user = await User.create(
      { ...userData, passwordHash: passwordHashed },
      { transaction }
    );

    if (allergies && allergies.length) {
      const allergyPromises = allergies.map((allergy) =>
        UserAllergy.create({ userId: user.id, allergy }, { transaction })
      );
      await Promise.all(allergyPromises);
    }
    const objectAllergies = allergies
      ? allergies.map((allergy) => ({ allergy }))
      : [];

    await transaction.commit();
    res.status(201).json({ ...user.toJSON(), UserAllergies: objectAllergies });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", tokenValidate, userFinder, async (req, res) => {
  const { id } = req.params;
  if (req.user) {
    if (
      parseInt(id) !== parseInt(req.user.id) ||
      req.session.status !== "admin"
    ) {
      res.status(401);
    }
    res.status(200).json(req.user);
  }
  res.status(404).end();
});

router.put("/:id", tokenValidate, userFinder, async (req, res) => {
  const transaction = await sequelize.transaction();
  if (req.user) {
    try {
      const {
        weight,
        height,
        age,
        diet,
        activityLevel,
        weightGoal,
        targetCalories,
        UserAllergies,
      } = req.body;
      const allergies = UserAllergies.map(al => al.allergy);
      const user = await User.findByPk(req.params.id, { transaction });

      user.weight = weight;
      user.height = height;
      user.age = age;
      user.diet = diet;
      user.activityLevel = activityLevel;
      user.weightGoal = weightGoal;
      user.targetCalories = targetCalories;

      await user.save({ transaction });

      if (allergies && allergies.length) {
        await UserAllergy.destroy({
          where: { userId: req.user.id },
          transaction,
        });

        const allergyPromises = allergies.map((allergy) =>
          UserAllergy.create({ userId: req.user.id, allergy }, { transaction })
        );
        await Promise.all(allergyPromises);
      }

      const objectAllergies = allergies
        ? allergies.map((allergy) => ({ allergy }))
        : [];

      await transaction.commit();
      res.json({ ...user.toJSON(), UserAllergies: objectAllergies });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

router.delete("/:id", tokenValidate, userFinder, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    await req.user.destroy({ transaction });
    await transaction.commit();
    res.status(204).end();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

//admin function only
router.get("/", tokenValidate, isAdmin, async (req, res) => {
  const { page = 1, search = "", group = "", limit = 2 } = req.query;
  const offset = (page - 1) * limit;
  let whereClause = {};
  const searchValue = search.trim();
  if (searchValue !== "") {
    whereClause = {
      [Op.or]: [
        { userName: { [Op.iLike]: `%${searchValue}%` } },
        { fullName: { [Op.iLike]: `%${searchValue}%` } },
        { email: { [Op.iLike]: `%${searchValue}%` } },
      ],
    };
  }

  if (group === "admin" || group === "active" || group === "locked") {
    whereClause = {
      ...whereClause,
      [Op.and]: [{ status: group }],
    };
  }
  try {
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      distinct: true,
      order: [["id", "ASC"]],
      include: [
        {
          model: UserAllergy,
          attributes: ["allergy"],
          required: false,
        },
      ],
    });
    const totalPages = Math.ceil(count / limit);
    res.json({ users: rows, totalPages });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/status/:userId", tokenValidate, isAdmin, async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!["active", "locked", "admin"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "user status updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});
//allergy table function
router.get("/:userId/allergies", async (req, res) => {
  const { userId } = req.params;
  const userAllergies = await UserAllergy.findAll({
    where: { userId: userId },
  });

  res.json(userAllergies);
});

router.put("/:userId/allergies", async (req, res) => {
  const { userId } = req.params;
  const { allergies } = req.body;

  try {
    await UserAllergy.destroy({
      where: { userId: userId },
    });

    const allergyPromises = allergies.map((allergy) =>
      UserAllergy.create({ userId: userId, allergy })
    );
    await Promise.all(allergyPromises);

    res.status(200).json({ message: "Allergies updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId/dishes", async (req, res) => {
  const { userId } = req.params;
  try {
    const userDishes = await Dish.findAll(
      {
        include: {
          model: DishAllergy,
          attributes: ["allergy"],
        },
      },
      { where: { userId: userId } }
    );
    res.json(userDishes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
