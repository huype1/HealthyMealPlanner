const express = require("express");
const app = express();
const { PORT } = require("./utils/config");
const {Umzug, SequelizeStorage} = require('umzug')

require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const { connectToDatabase, sequelize } = require("./utils/db");
const { errorHandler, unknownEndpoint } = require("./utils/middleware");
const umzug = new Umzug({
  migrations: {glob: 'migrations/*.js'},
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({sequelize}),
  logger: console,
})

const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const dishRouter = require("./controllers/dishes");
const logoutRouter = require("./controllers/logout");
const saveDishRouter = require("./controllers/save_dishes");
const mealPlanRouter = require("./controllers/meal_plans");
const commentRouter = require("./controllers/dish_comments")
const recipeRouter = require("./controllers/recipes")

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/dishes", dishRouter);
app.use("/api/save-dish", saveDishRouter);
app.use("/api/meal-plans", mealPlanRouter);
app.use("/api/comments", commentRouter);
app.use("/api/recipes", recipeRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  try {
    await connectToDatabase();
    await umzug.up()
    console.log('Migrations up to date')
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start the server:", err);
  }
};

start();
