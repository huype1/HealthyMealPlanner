const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, UserAllergy } = require("../models");
const { sequelize } = require("../utils/db");
//middleware
const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id, {
    include: [
      {
        model: UserAllergy,
        attributes: ["allergy"],
      },
    ],
  });
  next();
};
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: UserAllergy,
      attributes: ["allergy"],
    },
  });
  res.json(users);
});

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
    const objectAllergies = allergies ? allergies.map((allergy) => ({ allergy })) : [];
    
    await transaction.commit();
    res.status(201).json({ ...user.toJSON(), UserAllergies: objectAllergies });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", userFinder, async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", userFinder, async (req, res) => {
  const transaction = await sequelize.transaction();
  if (req.user) {
    try {
      const {
        fullName,
        weight,
        height,
        age,
        diet,
        activityLevel,
        weightGoal,
        targetCalories,
        allergies,
      } = req.body;

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

      const objectAllergies = allergies ? allergies.map((allergy) => ({ allergy })) : [];

      await transaction.commit();
      res.json({ ...user.toJSON(), UserAllergies: objectAllergies });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});


router.delete("/:id", userFinder, async (req, res) => {
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

router.get("/:userId/allergies", async (req, res) => {
  const { userId } = req.params;
  const userAllergies = await UserAllergy.findAll({
    where: { user_id: userId },
  });

  res.json(userAllergies);
});

router.put("/:userId/allergies", async (req, res) => {
  const { userId } = req.params;
  const { allergies } = req.body; // Expecting an array of allergy types

  try {
    // Delete existing allergies
    await UserAllergy.destroy({
      where: { user_id: userId },
    });

    // Add new allergies
    const allergyPromises = allergies.map((allergy) =>
      UserAllergy.create({ userId: userId, allergy })
    );
    await Promise.all(allergyPromises);

    res.status(200).json({ message: "Allergies updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
