const router = require("express").Router();
const {Dish, User, Recipe} = require("../models");
const {sequelize} = require("../utils/db");
const {tokenValidate} = require("../utils/middleware");
const {Op, literal} = require("sequelize");

router.get("/:dishId", async (req, res) => {
  const {dishId} = req.params
  const result = await Recipe.findAll({
    where: {dishId},
    order: [["step", "ASC"]],
  })
  res.status(200).json(result);
});

router.post("/", tokenValidate, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {dishId, step, content, imageUrl} = req.body;
    if (!dishId || !step || !content) {
      return res.status(400).json({ error: "Dish ID, step, and content are required." });
    }
    const user = await User.findByPk(req.decodedToken.id);
    const dish = await Dish.findByPk(dishId);
    if (!dish || !user) {
      return res.status(404).json({error: "Dish or user not found"});
    }
    if (dish.userId !== user.id) {
      return res.status(403).json({error: "You are not authorized to add step to this recipe"});
    }
    const recipe = await Recipe.create({dishId, step, content, imageUrl});
    await transaction.commit();
    res.status(201).json(recipe);
  } catch (error) {
    await transaction.rollback();
    console.error('Error Adding step into recipe:', error);
    res.status(500).json({
      error: error.message,
    });
  }
});


router.put("/:id", tokenValidate, async (req, res) => {
  const transaction = await sequelize.transaction();
  const {dishId, content, imageUrl} = req.body;
  const {id} = req.params;
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const dish = await Dish.findByPk(dishId);
    if (!dish || !user) {
      return res.status(404).json({error: "Dish or user not found"});
    }
    if (dish.userId !== user.id) {
      return res.status(403).json({error: "You are not authorized to edit the steps of this recipe"});
    }
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({error: "Cooking step not found"});
    }
    recipe.content = content;
    recipe.imageUrl = imageUrl;
    await recipe.save();

    await transaction.commit();
    res.status(200).json(recipe);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({error: error.message});
  }
});


router.delete("/:id", tokenValidate, async (req, res) => {
  try {
    const { id } = req.params;

    const stepToDelete = await Recipe.findByPk(id);
    if (!stepToDelete) {
      return res.status(404).json({ error: "Step not found" });
    }

    const { dishId, step: deletedStepNumber } = stepToDelete;

    await stepToDelete.destroy();
    await Recipe.update(
      { step: literal('step - 1') },
      {
        where: {
          dishId,
          step: {
            [Op.gt]: deletedStepNumber
          }
        }
      }
    );

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting step:', error);
    return res.status(500).json({ error: "Failed to delete step" });
  }
});
module.exports = router;
