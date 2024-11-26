const router = require("express").Router();
const {Dish, User, Comment} = require("../models");
const {sequelize} = require("../utils/db");
const {tokenValidate} = require("../utils/middleware");
const {Op} = require("sequelize");

router.get("/:dishId", async (req, res) => {
  const {dishId} = req.params
  const result = await Comment.findAll({
    where: {
      dishId,
    },
    include: [
      {
        model: User,
      }
    ],
    order: [["updatedAt", "DESC"]],
  })
  res.status(200).json(result);
});

router.get('/:dishId/:userId', async (req, res) => {
  try {
    const {dishId, userId} = req.params;
    const userComment = await Comment.findOne({
      where: {userId, dishId},
      include: [User],
    });

    if (!userComment) {
      return res.status(404).json({message: 'Comment not found or user does not exist.'});
    }

    return res.status(200).json(userComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'An error occurred'});
  }
});

router.post("/", tokenValidate, async (req, res) => {
  const transaction = await sequelize.transaction();
  const {imageUrl, rating, content, userId, dishId} = req.body;
  try {
    const dish = await Dish.findByPk(dishId)
    if (!dish) {
      return res.status(404).json({error: "Dish doesn't exist."});
    }
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(400).json({error: 'Invalid userId'});
    }
    const comment = Comment.create({
      imageUrl, rating, content, userId, dishId
    })
    dish.averageRating = (dish.averageRating * dish.ratings + rating) / (dish.ratings + 1)
    dish.ratings += 1;
    await dish.save();
    res.status(201).json(comment);

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating comment:', error);
    res.status(500).json({
      error: error.message,
    });
  }
});


router.put("/:dishId", tokenValidate, async (req, res) => {
  const {dishId} = req.params;
  const userId = req.decodedToken.id;
  const {content, imageUrl, rating} = req.body;
  const transaction = await sequelize.transaction();

  try {
    const dish = await Dish.findByPk(dishId, {transaction});
    if (!dish) {
      return res.status(404).json({error: "Dish not found"});
    }

    const comment = await Comment.findOne({
      where: {userId, dishId},
      include: [User],
    });

    if (!comment) {
      return res.status(404).json({error: "Comment not found"});
    }

    const previousRating = comment.rating || 0;
    dish.averageRating = (dish.averageRating * dish.ratings - previousRating + rating) / dish.ratings;
    await dish.save({transaction});

    if (content !== undefined) comment.content = content;
    if (imageUrl !== undefined) comment.imageUrl = imageUrl;
    if (rating !== undefined) comment.rating = rating;

    await comment.save({transaction});

    await transaction.commit();
    res.status(200).json(comment);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({error: error.message});
  }
});


router.delete("/:dishId", tokenValidate, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.decodedToken.id;
    const { dishId } = req.params;
    const dish = await Dish.findByPk(dishId, { transaction });
    if (!dish) {
      await transaction.rollback();
      return res.status(404).json({ error: "Dish not found" });
    }
    const comment = await Comment.findOne({
      where: { userId, dishId },
      include: [User],
      transaction,
    });
    if (!comment) {
      await transaction.rollback();
      return res.status(404).json({ error: "Comment not found" });
    }
    if (userId !== comment.userId) {
      await transaction.rollback();
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }
    const previousRating = comment.rating || 0;
    dish.averageRating = (dish.averageRating * dish.ratings - previousRating) / (dish.ratings - 1) || 0;
    dish.ratings -= 1;
    await dish.save({ transaction });
    await comment.destroy({ transaction });

    await transaction.commit();

    return res.status(204).end();
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});



module.exports = router;
